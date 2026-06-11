import { createPointService } from '@/features/point/infrastructure';
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
import { PointHistory } from '@/entities/point';
import { POINT_ACTION } from '@/entities/point';

export class BankTransferPaymentCommand
  implements IPaymentsCommand<void>, TransactionalCommand<void>
{
  private requestDto: BankTransferRequestDto;

  public constructor(requestDto: BankTransferRequestDto) {
    this.requestDto = requestDto;
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
    const pointService = createPointService();
    const histories = [] as PointHistory[];
    await Promise.all(
      ctx.orderList.map(async (orderListItem) => {
        // step 2-1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(ctx, orderListItem);
        // step 2-2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(ctx, orderListItem);
        // step 2-3. 사용 포인트 차감 히스토리 생성
        const history = await pointService.createUsageHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
          type: POINT_ACTION.use,
        });
        histories.push(history);
      }),
    );

    // step 3. 사용 포인트 차감
    await pointService.updateUserPointByHistories({
      user: ctx.userId,
      type: POINT_ACTION.use,
      histories,
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
