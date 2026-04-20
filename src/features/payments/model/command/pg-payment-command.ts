import { EndPointResult } from '@/shared/lib/end-point-result';
import { withTransaction } from '@/shared/lib/with-transaction';
import { getPointWhenUsingCard } from '@/entities/point/lib/calculator';
import {
  UsePointTransaction,
  EarnPointTransaction,
} from '@/entities/point/model/point-transaction';
import {
  EarnPointHistoryDto,
  UsePointHistoryDto,
} from '@/entities/point/model/schema/history.schema';
import { IPointTransaction } from '@/entities/point/model/interfaces';
import { cancelPgPaymentAll } from '@/entities/payment/lib/cancel-pg-payment-all';
import { OrderService } from '@/entities/order/model/services/service';
import { PAYMENTS_METHOD } from '@/entities/order';
import { OrderProductService } from '@/entities/order-product/model/services/service';
import { PaymentHistoryService } from '@/entities/payment-history/model/payment-history.service';
import {
  PGPaymentContextAfterApproval,
  PGPaymentContextAfterOrder,
  PGPaymentInitContext,
  toPaymentInitContext,
} from '../schema/payments-context-schema';
import { ApprovalPaymentResult } from '../schema/payments-approval-schema';
import { PaymentDto } from '../schema/payments.dto';
import { EnrichedOrderList, EnrichedOrderListItem } from '../schema/payment-order-list.schema';
import { enrichedOrderListFromContext } from '../enriched-order-list';
import { EasyPayService } from '@/entities/easypay/model/easypay.service';
import { type RegisterTransactionResult } from '@/entities/easypay/model/schemas/easypay.register-transaction-result.schema';
import { PaymentCommand } from './payment-command';
import { runWithTransaction } from '@/shared/lib/run-with-transaction';

export interface PGPaymentCommandResult {
  approvalDate: string;
  amount: number;
  shopOrderNo: string;
}

export class PGPaymentCommand<TContext extends PGPaymentInitContext> extends PaymentCommand<
  TContext,
  PGPaymentCommandResult
> {
  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    super(orderList, context);
  }

  static async create(context: PGPaymentInitContext) {
    const orderList = await enrichedOrderListFromContext(context);
    return new PGPaymentCommand(orderList, context);
  }

  static validatePaymentRegister(formData: FormData) {
    let data = {} as any;
    formData.forEach((value: any, key: string) => {
      data[key as string] = value;
    });

    const easyPayService = new EasyPayService();
    const validatedRegisterResult = easyPayService.validateAndParseRegisterTransactionResult(data);
    return validatedRegisterResult;
  }

  static createInitialContextFromRegisterResult(data: RegisterTransactionResult) {
    const context = toPaymentInitContext(data);
    return context;
  }

  public async run(): Promise<PGPaymentCommandResult> {
    const usePointTransaction = new UsePointTransaction();
    const earnPointTransaction = new EarnPointTransaction();

    // step 1. 결제승인 요청
    const approvalResult = await this.approvePayment();
    this.applyApprovalResultToContext(approvalResult);

    // step 2. 주문 생성
    const order = await this.createOrder();
    this.applyOrderIdToContext(order.id);

    // step 3. 주문 리스트 처리
    await this.processOrderList(usePointTransaction, earnPointTransaction);

    // step 4. 결제 내역 생성
    await this.createPaymentHistory();

    return {
      approvalDate: this.context.approvalDate,
      amount: this.context.amount,
      shopOrderNo: this.context.shopOrderNo,
    };
  }

  public async onRollback(): Promise<void> {
    // type arssert가 진행되지 않은 상태이기에 unknown 타입으로 먼저 캐스팅 -> 이 시점은 결제가 승인되었다는 전제하에 진행된다.
    const manager = this as unknown as PGPaymentCommand<PGPaymentContextAfterOrder>;
    if (manager.context?.pgCno) {
      await cancelPgPaymentAll(manager.context.amount, manager.context.pgCno);
    }
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  protected async approvePayment() {
    const easyPayService = new EasyPayService();
    const approvalRequestDto = PaymentDto.approvePayment(this.context);
    const approvalResult = await easyPayService.approvePayment(approvalRequestDto);
    return approvalResult;
  }

  protected applyApprovalResultToContext(
    approvalResult: ApprovalPaymentResult,
  ): asserts this is PGPaymentCommand<PGPaymentContextAfterApproval> {
    const {
      amount,
      pgCno,
      paymentInfo: { approvalDate },
    } = approvalResult;

    this.context = {
      ...this.context,
      amount,
      pgCno,
      approvalDate,
    };
  }

  protected applyOrderIdToContext(
    orderId: number,
  ): asserts this is PGPaymentCommand<PGPaymentContextAfterOrder> {
    this.context = {
      ...this.context,
      orderId,
    };
  }

  protected async createOrder(this: PGPaymentCommand<PGPaymentContextAfterApproval>) {
    const orderService = OrderService.for(PAYMENTS_METHOD.CREDIT_CARD);
    const dto = PaymentDto.createOrderForPG(this.context);
    const order = await orderService.createOrder(dto);

    return order;
  }

  /**
   * side effect: 주문 상품 생성, 구매 히스토리 생성, 사용 포인트 차감, 구매 포인트 적립
   */
  protected async processOrderList(
    this: PGPaymentCommand<PGPaymentContextAfterOrder>,
    usePointTransaction: IPointTransaction<UsePointHistoryDto>,
    earnPointTransaction: IPointTransaction<EarnPointHistoryDto>,
  ) {
    let earnedPoint = 0;

    await Promise.all(
      this.orderList.map(async (orderListItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(orderListItem);
        // step 2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(orderListItem);
        // step 3. 사용 포인트 차감 히스토리 생성
        await usePointTransaction.createHistory({
          user: this.context.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
        });
        // step 4. 구매 포인트 적립 히스토리 생성
        const willEarnPoint = getPointWhenUsingCard(orderListItem.product) * orderListItem.quantity;
        earnedPoint += willEarnPoint;
        await earnPointTransaction.createHistory({
          user: this.context.userId,
          orderProduct: orderProduct.id,
          amount: willEarnPoint,
        });
      }),
    );

    // step 5. 구매 포인트 적립
    await earnPointTransaction.updateUserPoint(this.context.userId, earnedPoint);
    // step 6. 사용 포인트 차감
    await usePointTransaction.updateUserPoint(this.context.userId, this.context.usedPoint);
  }

  protected async createPaymentHistory(this: PGPaymentCommand<PGPaymentContextAfterOrder>) {
    const paymentHistoryService = new PaymentHistoryService();
    const dto = PaymentDto.createPaymentHistory(this.context);

    await paymentHistoryService.createHistory(dto);
  }

  private async createOrderProduct(
    this: PGPaymentCommand<PGPaymentContextAfterOrder>,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductService = OrderProductService.for(PAYMENTS_METHOD.CREDIT_CARD);
    const requestDto = PaymentDto.createOrderProduct(this.context, orderListItem);
    const orderProduct = await orderProductService.createOrderProduct(requestDto);

    return orderProduct;
  }
}
