import { RecentPurchasedHistoryService } from '@/entities/recent-purchased-history/model/recent-purchased-history.service';
import { BasePaymentContext } from '../schema/payments-context-schema';
import { PaymentDto } from '../schema/payments.dto';
import {
  type EnrichedOrderList,
  type EnrichedOrderListItem,
} from '../schema/payment-order-list.schema';
import { TransactionalCommand } from '@/shared/lib/run-with-transaction';
import { IPaymentsCommand } from '../interfaces';

export abstract class PaymentCommand<TContext extends BasePaymentContext, TResult = void>
  implements IPaymentsCommand<TResult>, TransactionalCommand<TResult>
{
  protected orderList: EnrichedOrderList;
  protected context: TContext;

  public abstract execute(): Promise<TResult>;
  public abstract run(): Promise<TResult>;

  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    this.orderList = orderList;
    this.context = context;
  }

  // 구매 히스토리 생성
  protected async createRecentPurchasedHistory(
    orderListItem: EnrichedOrderListItem,
  ): Promise<void> {
    const recentPurchasedHistoryService = new RecentPurchasedHistoryService();
    const dto = PaymentDto.createRecentPurchasedHistory(this.context, orderListItem);
    await recentPurchasedHistoryService.createHistory(dto);
  }
}
