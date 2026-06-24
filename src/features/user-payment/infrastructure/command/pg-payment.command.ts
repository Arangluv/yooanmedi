import { BasePayload } from 'payload';
import { BaseError } from '@/shared';
import { TransactionCommand } from '@/shared/server';
import { PointHistory, PointHistoryRepository } from '@/entities/point';
import { UserRepository } from '@/entities/user';
import { OperatorResultOrder, OrderRepository } from '@/entities/order';
import { OrderProduct, OrderProductRepository } from '@/entities/order-product';
import { PurchasedHistoryRepository } from '@/entities/purchased-history';
import {
  EasyPayPaymentApprovalResult,
  EasyPayPaymentCancelRequestDto,
  EasyPayRepository,
} from '@/entities/easypay';
import { PaymentHistoryRepository } from '@/entities/payment';
import { PGPaymentCommandDto, PaymentOrderItemDto, PGPaymentCommandResult } from '../../dto';
import { PGPaymentMapper } from '../../mapper';
import { UserPaymentError } from '../../core';

export interface PGPaymentCommandDependencies {
  payload: BasePayload;
  repository: {
    easyPay: EasyPayRepository;
    pointHistory: PointHistoryRepository;
    user: UserRepository;
    order: OrderRepository;
    orderProduct: OrderProductRepository;
    purchasedHistory: PurchasedHistoryRepository;
    paymentHistory: PaymentHistoryRepository;
  };
}

export class PGPaymentCommand extends TransactionCommand<PGPaymentCommandResult> {
  private readonly dto: PGPaymentCommandDto;
  private readonly repository: PGPaymentCommandDependencies['repository'];
  private rollbackDto: EasyPayPaymentCancelRequestDto | null;

  constructor(dto: PGPaymentCommandDto, dependencies: PGPaymentCommandDependencies) {
    super(dependencies.payload);
    this.dto = dto;
    this.repository = dependencies.repository;
    this.rollbackDto = null;
  }

  async run() {
    try {
      const usedPointHistories = [] as PointHistory[];
      const earnPointHistores = [] as PointHistory[];
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
          // step 2-4. 포인트 적립 히스토리 생성
          const earnPointHistory = await this.createEarnPointHistory({ orderItem, orderProduct });
          earnPointHistores.push(earnPointHistory);
        }),
      );

      // step 3. 유저 사용포인트 차감
      await this.subtractUserPoint(usedPointHistories);
      // step 4. 유저 포인트 적립
      await this.addUserPoint(earnPointHistores);
      // step 5. 결제승인 요청
      const approvalResult = await this.approvePayment();
      // step 6. 결제내역 생성
      await this.createPaymentHistory({ order, approvalResult });

      return {
        approvalDate: approvalResult.paymentInfo.approvalDate,
        amount: approvalResult.amount,
        shopOrderNo: approvalResult.shopOrderNo,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw UserPaymentError.paymentFail();
    }
  }

  async onRollback() {
    if (this.rollbackDto) {
      await this.repository.easyPay.totalCancel(this.rollbackDto);
    }
  }

  private async createOrder(): Promise<OperatorResultOrder> {
    const dto = PGPaymentMapper.toCreateOrderDto(this.dto);
    return await this.repository.order.create(dto);
  }

  private async createOrderProduct(
    order: OperatorResultOrder,
    orderItem: PaymentOrderItemDto,
  ): Promise<OrderProduct> {
    const dto = PGPaymentMapper.toCreateOrderProductDto(order, orderItem);
    return await this.repository.orderProduct.create(dto);
  }

  private async createRecentPurchasedHistory(orderItem: PaymentOrderItemDto): Promise<void> {
    const dto = PGPaymentMapper.toPurchasedHistoryDto(this.dto.user.id, orderItem);
    await this.repository.purchasedHistory.create(dto);
  }

  private async createUsePointHistory({
    orderItem,
    orderProduct,
  }: {
    orderItem: PaymentOrderItemDto;
    orderProduct: OrderProduct;
  }) {
    const dto = PGPaymentMapper.toCreateUsePointHistoryDto({
      dto: this.dto,
      orderItem,
      orderProduct,
    });
    const history = await this.repository.pointHistory.createUsageHistory(dto);
    return history;
  }

  private async createEarnPointHistory({
    orderItem,
    orderProduct,
  }: {
    orderItem: PaymentOrderItemDto;
    orderProduct: OrderProduct;
  }) {
    const pointItem = PGPaymentMapper.orderItemtoPointItem(orderItem);
    const dto = PGPaymentMapper.toCreateEarnPointHistoryDto({
      dto: this.dto,
      pointItem,
      orderProduct,
    });

    const history = await this.repository.pointHistory.createUsageHistory(dto);
    return history;
  }

  private async subtractUserPoint(histories: PointHistory[]) {
    const user = await this.repository.user.findById(this.dto.user.id);
    const dto = PGPaymentMapper.toUpdateUserPointDtoForUse({ user, histories });
    await this.repository.user.update(dto);
  }

  private async addUserPoint(histories: PointHistory[]) {
    const user = await this.repository.user.findById(this.dto.user.id);
    const dto = PGPaymentMapper.toUpdateUserPointDtoForEarn({ user, histories });
    await this.repository.user.update(dto);
  }

  private async approvePayment(): Promise<EasyPayPaymentApprovalResult> {
    const dto = PGPaymentMapper.toApprovePaymentDto(this.dto);
    const result = await this.repository.easyPay.approvePayment(dto);

    this.rollbackDto = { pgCno: result.pgCno, amount: result.amount };

    if (result.amount !== this.dto.paymentInfo.totalAmount) {
      throw UserPaymentError.paymentFail('결제요청 금액과 승인금액이 일치하지 않습니다');
    }

    return result;
  }

  private async createPaymentHistory({
    order,
    approvalResult,
  }: {
    order: OperatorResultOrder;
    approvalResult: EasyPayPaymentApprovalResult;
  }) {
    const dto = PGPaymentMapper.toCreatePaymentHistoryDto({ order, approvalResult });
    return await this.repository.paymentHistory.create(dto);
  }
}
