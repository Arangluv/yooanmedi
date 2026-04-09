import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history/api/create';
import { BasePaymentContext } from '../schema/payment-context-schema';
import { PaymentDto } from '../schema/payments.dto';
import { type EnrichedOrderList, type EnrichedOrderListItem } from '../schema/order-list.schema';

export abstract class PaymentManager<TContext extends BasePaymentContext> {
  protected orderList: EnrichedOrderList;
  protected context: TContext;

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
}
