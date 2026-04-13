import { RecentPurchasedHistoryService } from '@/entities/recent-purchased-history/model/recent-purchased-history.service';
import { UsecaseResult } from '@/shared/model/type';
import { BasePaymentContext } from '../schema/payment-context-schema';
import { PaymentDto } from '../schema/payments.dto';
import { type EnrichedOrderList, type EnrichedOrderListItem } from '../schema/order-list.schema';

export abstract class PaymentManager<TContext extends BasePaymentContext, TData = never> {
  protected orderList: EnrichedOrderList;
  protected context: TContext;

  abstract execute(): Promise<UsecaseResult<TData>>;

  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    this.orderList = orderList;
    this.context = context;
  }

  // 구매 히스토리 생성
  protected async makeRecentPurchasedHistory(orderListItem: EnrichedOrderListItem): Promise<void> {
    const recentPurchasedHistoryService = new RecentPurchasedHistoryService();
    const dto = PaymentDto.createRecentPurchasedHistory(this.context, orderListItem);
    await recentPurchasedHistoryService.createHistory(dto);
  }
}
