import { BasePayload } from 'payload';
import { BaseError } from '@/shared';
import { TransactionCommand } from '@/shared/server';
import { PointHistory, PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { Order, OrderRepository } from '@/entities/order';
import { OrderProduct, OrderProductRepository } from '@/entities/order-product';
import { PurchasedHistoryRepository } from '@/entities/purchased-history';
import { PaymentByBankTransferRequestDto, PaymentOrderItemDto } from '../../dto';
import { BankTransferPaymentMapper } from '../../mapper';
import { PaymentError } from '../../core';

interface BankTransferCommandResult {
  ok: boolean;
}

interface BankTransferCommandDependencies {
  payload: BasePayload;
  repository: {
    pointHistory: PointHistoryRepository;
    user: UserRepository;
    order: OrderRepository;
    orderProduct: OrderProductRepository;
    purchasedHistory: PurchasedHistoryRepository;
  };
}

export class PaymentCommandForBankTransfer extends TransactionCommand<BankTransferCommandResult> {
  private readonly dto: PaymentByBankTransferRequestDto;
  private readonly repository: BankTransferCommandDependencies['repository'];

  constructor(dto: PaymentByBankTransferRequestDto, dependencies: BankTransferCommandDependencies) {
    super(dependencies.payload);
    this.dto = dto;
    this.repository = dependencies.repository;
  }

  async run() {
    try {
      const usedPointHistories = [] as PointHistory[];
      const { orderList } = this.dto.paymentInfo;

      // step 1. 주문 생성
      const order = await this.createOrder();

      await Promise.all(
        orderList.map(async (orderItem: PaymentOrderItemDto) => {
          // step 2-1. 주문상품 생성
          const orderProduct = await this.createOrderProduct(order, orderItem);
          // step 2-2. 최근 구매 히스토리 생성
          await this.createRecentPurchasedHistory(orderItem);
          // step 2-3. 사용 포인트 차감 히스토리 생성
          const usedPointHistory = await this.createUsePointHistory({ orderItem, orderProduct });
          usedPointHistories.push(usedPointHistory);
        }),
      );

      // step 3. 유저 사용포인트 차감
      await this.subtractUserPoint(usedPointHistories);

      return { ok: true };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw PaymentError.paymentFail();
    }
  }

  private async createOrder(): Promise<Order> {
    const dto = BankTransferPaymentMapper.toCreateOrderDto(this.dto);
    return await this.repository.order.create(dto);
  }

  private async createOrderProduct(
    order: Order,
    orderItem: PaymentOrderItemDto,
  ): Promise<OrderProduct> {
    const dto = BankTransferPaymentMapper.toCreateOrderProductDto(order, orderItem);
    return await this.repository.orderProduct.create(dto);
  }

  private async createRecentPurchasedHistory(orderItem: PaymentOrderItemDto): Promise<void> {
    const dto = BankTransferPaymentMapper.toPurchasedHistoryDto(this.dto.user.id, orderItem);
    await this.repository.purchasedHistory.create(dto);
  }

  private async createUsePointHistory({
    orderItem,
    orderProduct,
  }: {
    orderItem: PaymentOrderItemDto;
    orderProduct: OrderProduct;
  }) {
    const dto = BankTransferPaymentMapper.toCreateUsePointHistoryDto({
      dto: this.dto,
      orderItem,
      orderProduct,
    });
    const history = await this.repository.pointHistory.createUsageHistory(dto);
    return history;
  }

  private async subtractUserPoint(histories: PointHistory[]) {
    const user = await this.repository.user.findById(this.dto.user.id);
    const dto = BankTransferPaymentMapper.toUpdateUserPointDtoForUse({ user, histories });
    await this.repository.user.update(dto);
  }
}
