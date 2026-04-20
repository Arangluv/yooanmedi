import { PaymentDto } from '../schema/payments.dto';
import { EnrichedOrderList, EnrichedOrderListItem } from '../schema/order-list.schema';
import { enrichedOrderListFromContext } from '../enriched-order-list';
import { UsePointTransaction } from '@/entities/point/model/point-transaction';
import { OrderService } from '@/entities/order/model/services/service';
import { PAYMENTS_METHOD } from '@/entities/order';
import { OrderProductService } from '@/entities/order-product/model/services/service';
// 여기에 밑으로 다시 import
import { runWithTransaction, TransactionalCommand } from '@/shared/lib/run-with-transaction';
import { IPaymentsCommand } from '../interfaces';
import { type BankTransferRequestDto } from '../schema/banktransfer-request.schema';
import { RecentPurchasedHistoryService } from '@/entities/recent-purchased-history/model/recent-purchased-history.service';
import {
  toBankTransferInitContext,
  type BankTransferPaymentInitContext,
  type BankTransferPaymentAfterOrderContext,
} from '../schema/payment-context-schema';

export class BankTransferPaymentCommand
  implements IPaymentsCommand<void>, TransactionalCommand<void>
{
  private requestDto: BankTransferRequestDto;

  public constructor(requestDto: BankTransferRequestDto) {
    this.requestDto = requestDto;
  }

  public async run(): Promise<void> {
    const initCtx = this.initializeContext(); // 이 부분 추가
    const afterOrderCtx = await this.createOrder(initCtx);

    await this.processOrderList(afterOrderCtx);
  }

  public async execute(): Promise<void> {
    return await runWithTransaction(this);
  }

  private initializeContext(): BankTransferPaymentInitContext {
    return toBankTransferInitContext(this.requestDto);
  }

  private async createOrder(
    ctx: BankTransferPaymentInitContext,
  ): Promise<BankTransferPaymentAfterOrderContext> {
    const orderService = OrderService.for(PAYMENTS_METHOD.BANK_TRANSFER);
    const dto = PaymentDto.createOrderForBankTransfer(ctx);
    const order = await orderService.createOrder(dto);

    return {
      ...ctx,
      orderId: order.id,
    };
  }

  private async processOrderList(ctx: BankTransferPaymentAfterOrderContext) {
    const usePointTransaction = new UsePointTransaction();

    await Promise.all(
      this.orderList.map(async (orderListItem) => {
        // step 2-1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(orderListItem);
        // step 2-2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(orderListItem);
        // step 2-3. 사용 포인트 차감 히스토리 생성
        await usePointTransaction.createHistory({
          user: this.context.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
        });
      }),
    );

    // step 3. 사용 포인트 차감
    await usePointTransaction.updateUserPoint(this.context.userId, this.context.usedPoint);
  }

  private async createRecentPurchasedHistory(orderListItem: EnrichedOrderListItem): Promise<void> {
    const recentPurchasedHistoryService = new RecentPurchasedHistoryService();
    const dto = PaymentDto.createRecentPurchasedHistory(this.context, orderListItem);
    await recentPurchasedHistoryService.createHistory(dto);
  }

  private async createOrderProduct(orderListItem: EnrichedOrderListItem) {
    const orderProductService = OrderProductService.for(PAYMENTS_METHOD.BANK_TRANSFER);
    const requestDto = PaymentDto.createOrderProduct(this.context, orderListItem);
    const orderProduct = await orderProductService.createOrderProduct(requestDto);

    return orderProduct;
  }
}
