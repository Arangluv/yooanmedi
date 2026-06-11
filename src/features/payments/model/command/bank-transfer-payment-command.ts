import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import {
  PurchasedHistoryApiRepository,
  PurchasedHistoryAdapter,
} from '@/entities/purchased-history/infrastructure';
import { runWithTransaction } from '@/shared/infrastructure';
import { TransactionalCommand } from '@/shared';
import { PaymentDto } from '../schemas/payments.dto';
import { EnrichedOrderListItem } from '../schemas/payment-order-list.schema';
import { enrichOrderList } from '../enrich-order-list';
import { IPaymentsCommand } from '../interfaces';
import { type BankTransferRequestDto } from '../schemas/bank-transfer-request.schema';
import { BankTransferContextFactory, PaymentContextFactory } from '../context.factory';
import {
  BankTransferPaymentAfterOrderContext,
  BankTransferPaymentInitContext,
} from '../schemas/payments-context/bank-transfer.schema';
import {
  PointHistory,
  POINT_ACTION,
  PointHistoryRepository,
  PointCalculator,
} from '@/entities/point';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserRepository } from '@/entities/user';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';

export class BankTransferPaymentCommand
  implements IPaymentsCommand<void>, TransactionalCommand<void>
{
  private requestDto: BankTransferRequestDto;
  private pointHistoryRepository: PointHistoryRepository;
  private userRepository: UserRepository;

  public constructor(requestDto: BankTransferRequestDto) {
    this.requestDto = requestDto;
    this.pointHistoryRepository = new PointHistoryApiRepository(PointHistoryAdapter());
    this.userRepository = new UserApiRepository(UserAdapter());
  }

  public async run(): Promise<void> {
    const contextFactory = new BankTransferContextFactory();
    const initCtx = await this.initializeContext(contextFactory);
    const afterOrderCtx = await this.createOrder(initCtx);

    await this.processOrderList(afterOrderCtx);
  }

  public async execute(): Promise<void> {
    return await runWithTransaction(this);
  }

  private async initializeContext(
    contextFactory: PaymentContextFactory,
  ): Promise<BankTransferPaymentInitContext> {
    const baseContext = contextFactory.createBase(this.requestDto);
    const orderList = await enrichOrderList(baseContext);

    return contextFactory.initialize({ ...baseContext, orderList, amount: this.requestDto.amount });
  }

  private async createOrder(
    ctx: BankTransferPaymentInitContext,
  ): Promise<BankTransferPaymentAfterOrderContext> {
    const orderRepository = new OrderApiRepository(OrderAdapter());
    const dto = PaymentDto.createOrderForBankTransfer(ctx);
    const order = await orderRepository.create(dto);

    return {
      ...ctx,
      orderId: order.id,
    };
  }

  private async processOrderList(ctx: BankTransferPaymentAfterOrderContext) {
    const histories = [] as PointHistory[];
    await Promise.all(
      ctx.orderList.map(async (orderListItem) => {
        // step 2-1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(ctx, orderListItem);
        // step 2-2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(ctx, orderListItem);
        // step 2-3. 사용 포인트 차감 히스토리 생성
        const history = await this.pointHistoryRepository.createUsageHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
          type: POINT_ACTION.use,
        });
        histories.push(history);
      }),
    );

    // step 3. 사용 포인트 차감
    const user = await this.userRepository.findById(ctx.userId);
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistories(histories),
      action: POINT_ACTION.cancel_earn,
    });
    await this.userRepository.update({
      user: ctx.userId,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async createRecentPurchasedHistory(
    ctx: BankTransferPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ): Promise<void> {
    const purchasedHistoryRepository = new PurchasedHistoryApiRepository(PurchasedHistoryAdapter());
    const dto = PaymentDto.createRecentPurchasedHistory(ctx, orderListItem);
    await purchasedHistoryRepository.create(dto);
  }

  private async createOrderProduct(
    ctx: BankTransferPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    const requestDto = PaymentDto.createOrderProductForBank(ctx, orderListItem);
    const orderProduct = await orderProductRepository.create(requestDto);

    return orderProduct;
  }
}
