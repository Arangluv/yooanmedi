import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history/api/create';
import { BasePaymentContext } from '../schema/payment-context-schema';
import { Order } from '@/entities/order/model/type';
import { PaymentDto } from '../schema/payments.dto';
import { UsePointTransaction } from '@/entities/point/lib/use/point-transaction';
import { type EnrichedOrderList, type EnrichedOrderListItem } from '../schema/order-list.schema';

export abstract class PaymentManager<TContext extends BasePaymentContext> {
  protected orderList: EnrichedOrderList;
  protected context: TContext;

  abstract createOrder(): Promise<Order>;
  abstract processOrderSideEffects(): Promise<void>;
  abstract execute(): Promise<void>;

  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    this.orderList = orderList;
    this.context = context;
  }

  // 결제 컨텍스트 조회
  public getContext(): TContext {
    return this.context;
  }

  // 구매 히스토리 생성
  protected async makeRecentPurchasedHistory(orderListItem: EnrichedOrderListItem): Promise<void> {
    const dto = PaymentDto.createRecentPurchasedHistory(this.context, orderListItem);
    await createRecentPurchasedHistory(dto);
  }

  // 사용 포인트 차감
  protected async deductUsedPoint(
    orderListItem: EnrichedOrderListItem,
    orderProductId: number,
  ): Promise<void> {
    const paymentPointTransaction = new UsePointTransaction({
      userId: this.context.userId,
      orderProductId: orderProductId,
    });
    await paymentPointTransaction.initializeContext();
    await paymentPointTransaction.createHistory(orderListItem.calculatedUsedPoint);
    await paymentPointTransaction.deductUserPoint(orderListItem.calculatedUsedPoint);
  }
}
