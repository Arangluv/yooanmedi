import { UsePointTransaction } from '@/entities/point/model/point-transaction';
import { OrderService } from '@/entities/order/model/services/service';
import { OrderProductService } from '@/entities/order-product/model/services/service';
import { RecentPurchasedHistoryService } from '@/entities/recent-purchased-history/model/recent-purchased-history.service';
import { runWithTransaction, TransactionalCommand } from '@/shared/infrastructure';
import { PAYMENTS_METHOD } from '@/shared';
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
    const orderService = OrderService.for(PAYMENTS_METHOD.bank_transfer);
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
      ctx.orderList.map(async (orderListItem) => {
        // step 2-1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(ctx, orderListItem);
        // step 2-2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(ctx, orderListItem);
        // step 2-3. 사용 포인트 차감 히스토리 생성
        await usePointTransaction.createHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
        });
      }),
    );

    // step 3. 사용 포인트 차감
    await usePointTransaction.updateUserPoint(ctx.userId, ctx.usedPoint);
  }

  private async createRecentPurchasedHistory(
    ctx: BankTransferPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ): Promise<void> {
    const recentPurchasedHistoryService = new RecentPurchasedHistoryService();
    const dto = PaymentDto.createRecentPurchasedHistory(ctx, orderListItem);
    await recentPurchasedHistoryService.createHistory(dto);
  }

  private async createOrderProduct(
    ctx: BankTransferPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductService = OrderProductService.for(PAYMENTS_METHOD.bank_transfer);
    const requestDto = PaymentDto.createOrderProduct(ctx, orderListItem);
    const orderProduct = await orderProductService.createOrderProduct(requestDto);

    return orderProduct;
  }
}
