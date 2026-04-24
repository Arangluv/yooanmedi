import { getPointWhenUsingCard } from '@/entities/point/lib/calculator';
import {
  UsePointTransaction,
  EarnPointTransaction,
} from '@/entities/point/model/point-transaction';
import { cancelPgPaymentAll } from '@/entities/payment/lib/cancel-pg-payment-all';
import { OrderService } from '@/entities/order/model/services/service';
import { PAYMENTS_METHOD } from '@/entities/order';
import { OrderProductService } from '@/entities/order-product/model/services/service';
import { PaymentHistoryService } from '@/entities/payment-history/model/payment-history.service';
import { EasyPayService } from '@/entities/easypay/model/easypay.service';
import { RecentPurchasedHistoryService } from '@/entities/recent-purchased-history/model/recent-purchased-history.service';
import { runWithTransaction, TransactionalCommand } from '@/shared/infrastructure';
import { PaymentDto } from '../schemas/payments.dto';
import { EnrichedOrderListItem } from '../schemas/payment-order-list.schema';
import { enrichOrderList } from '../enrich-order-list';
import { IPaymentsCommand } from '../interfaces';
import { PaymentContextFactory, PGContextFactory } from '../context.factory';
import {
  PGPaymentAfterApprovalContext,
  PGPaymentAfterOrderContext,
  PGPaymentInitContext,
} from '../schemas/payments-context/pg.schema';

export interface PGPaymentCommandResult {
  approvalDate: string;
  amount: number;
  shopOrderNo: string;
}

export class PGPaymentCommand
  implements IPaymentsCommand<PGPaymentCommandResult>, TransactionalCommand<PGPaymentCommandResult>
{
  private requestDto: FormData;
  private context:
    | null
    | PGPaymentInitContext
    | PGPaymentAfterApprovalContext
    | PGPaymentAfterOrderContext;
  public constructor(requestDto: FormData) {
    this.requestDto = requestDto;
    this.context = null;
  }

  public async run(): Promise<PGPaymentCommandResult> {
    const contextFactory = new PGContextFactory();
    const initCtx = await this.initializeContext(contextFactory);

    // step 1. 결제승인 요청
    const afterApprovalCtx = await this.approvePayment(initCtx);
    // step 2. 주문 생성
    const afterOrderCtx = await this.createOrder(afterApprovalCtx);
    // step 3. 주문 리스트 처리
    await this.processOrderList(afterOrderCtx);
    // step 4. 결제 내역 생성
    await this.createPaymentHistory(afterOrderCtx);

    return {
      approvalDate: afterOrderCtx.approvalDate,
      amount: afterOrderCtx.amount,
      shopOrderNo: afterOrderCtx.shopOrderNo,
    };
  }

  public async onRollback(): Promise<void> {
    if (this.context && 'pgCno' in this.context) {
      await cancelPgPaymentAll(this.context.amount, this.context.pgCno);
    }
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  private async initializeContext(PaymentContextFactory: PaymentContextFactory) {
    const registerResult = this.refineEasypayRegisterResult();
    const baseContext = PaymentContextFactory.createBase(registerResult);
    const orderList = await enrichOrderList(baseContext);

    const initCtx = PaymentContextFactory.initialize({
      ...baseContext,
      orderList,
      authorizationId: registerResult.authorizationId,
    });
    this.context = initCtx;

    return initCtx;
  }

  private refineEasypayRegisterResult() {
    let data = {} as any;
    this.requestDto.forEach((value: any, key: string) => {
      data[key as string] = value;
    });

    const easyPayService = new EasyPayService();
    return easyPayService.validateAndParseRegisterTransactionResult(data);
  }

  private async approvePayment(ctx: PGPaymentInitContext) {
    const easyPayService = new EasyPayService();
    const dto = PaymentDto.approvePayment(ctx);
    const approvalResult = await easyPayService.approvePayment(dto);

    const afterApprovalCtx = {
      ...ctx,
      pgCno: approvalResult.pgCno,
      amount: approvalResult.amount,
      approvalDate: approvalResult.paymentInfo.approvalDate,
    };
    this.context = afterApprovalCtx;
    return afterApprovalCtx;
  }

  private async createOrder(ctx: PGPaymentAfterApprovalContext) {
    const orderService = OrderService.for(PAYMENTS_METHOD.CREDIT_CARD);
    const dto = PaymentDto.createOrderForPG(ctx);
    const order = await orderService.createOrder(dto);

    const afterOrderCtx = {
      ...ctx,
      orderId: order.id,
    };
    this.context = afterOrderCtx;
    return afterOrderCtx;
  }

  /**
   * side effect: 주문 상품 생성, 구매 히스토리 생성, 사용 포인트 차감, 구매 포인트 적립
   */
  private async processOrderList(ctx: PGPaymentAfterOrderContext) {
    let earnedPoint = 0;
    const usePointTransaction = new UsePointTransaction();
    const earnPointTransaction = new EarnPointTransaction();

    await Promise.all(
      ctx.orderList.map(async (orderListItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(ctx, orderListItem);
        // step 2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(ctx, orderListItem);
        // step 3. 사용 포인트 차감 히스토리 생성
        await usePointTransaction.createHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
        });
        // step 4. 구매 포인트 적립 히스토리 생성
        const willEarnPoint = getPointWhenUsingCard(orderListItem.product) * orderListItem.quantity;
        earnedPoint += willEarnPoint;
        await earnPointTransaction.createHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: willEarnPoint,
        });
      }),
    );

    // step 5. 구매 포인트 적립
    await earnPointTransaction.updateUserPoint(ctx.userId, earnedPoint);
    // step 6. 사용 포인트 차감
    await usePointTransaction.updateUserPoint(ctx.userId, ctx.usedPoint);
  }

  private async createOrderProduct(
    ctx: PGPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductService = OrderProductService.for(PAYMENTS_METHOD.CREDIT_CARD);
    const requestDto = PaymentDto.createOrderProduct(ctx, orderListItem);
    const orderProduct = await orderProductService.createOrderProduct(requestDto);

    return orderProduct;
  }

  private async createRecentPurchasedHistory(
    ctx: PGPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ): Promise<void> {
    const recentPurchasedHistoryService = new RecentPurchasedHistoryService();
    const dto = PaymentDto.createRecentPurchasedHistory(ctx, orderListItem);
    await recentPurchasedHistoryService.createHistory(dto);
  }

  private async createPaymentHistory(ctx: PGPaymentAfterOrderContext) {
    const paymentHistoryService = new PaymentHistoryService();
    const dto = PaymentDto.createPaymentHistory(ctx);
    await paymentHistoryService.createHistory(dto);
  }
}
