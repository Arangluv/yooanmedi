import { PaymentManager } from './payment-manager';
import {
  validatePaymentRegisterSchema,
  ValidatePaymentRegister,
} from '../schema/register-response-schema';
import {
  PGPaymentContextAfterApproval,
  PGPaymentContextAfterOrder,
  PGPaymentInitContext,
  pgPaymentInitContextSchema,
} from '../schema/payment-context-schema';
import { paymentsApproval } from '../../api/payment-approval';
import {
  ApprovalPaymentResult,
  approvalPaymentResultSchema,
} from '../schema/payments-approval-schema';
import { PaymentDto } from '../schema/payments.dto';
import { createOrder as createOrderFromEntityLayer } from '@/entities/order';
import { createOrderProduct as createOrderProductFromEntityLayer } from '@/entities/order-product/api/create-order-product';
import { getPointWhenUsingCard } from '@/entities/point/lib/calculator';
import { createPayment } from '@/entities/payment/api/create';
import { zodSafeParse } from '@/shared/lib/zod';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';
import { withTransaction } from '@/shared/lib/with-transaction';
import { EnrichedOrderList, EnrichedOrderListItem } from '../schema/order-list.schema';
import { enrichedOrderListFromContext } from '../enriched-order-list';
import {
  UsePointTransaction,
  EarnPointTransaction,
} from '@/entities/point/model/point-transaction';
import {
  EarnPointHistoryDto,
  UsePointHistoryDto,
} from '@/entities/point/model/schema/history.schema';
import { IPointTransaction } from '@/entities/point/model/interfaces';
import { UsecaseResult } from '@/shared/model/type';
import { cancelPgPaymentAll } from '@/entities/payment/lib/cancel-pg-payment-all';

interface PaymentUsecaseResultData {
  approvalDate: string;
  amount: number;
  shopOrderNo: string;
}

export class PGPaymentManager<TContext extends PGPaymentInitContext> extends PaymentManager<
  TContext,
  PaymentUsecaseResultData
> {
  protected constructor(orderList: EnrichedOrderList, context: TContext) {
    super(orderList, context);
  }

  static async create(context: PGPaymentInitContext) {
    const orderList = await enrichedOrderListFromContext(context);
    return new PGPaymentManager(orderList, context);
  }

  static validatePaymentRegister(formData: FormData) {
    let data = {} as Record<string, string>;
    formData.forEach((value: any, key: string) => {
      data[key as string] = value;
    });

    const registerResult = zodSafeParse(validatePaymentRegisterSchema, data);

    if (!registerResult.isSuccess) {
      const error = new BusinessLogicError('결제 등록과정에서 문제가 발생했습니다');
      const debugMessage = `resCd: ${registerResult.resCd}, resMsg: ${registerResult.resMsg}`;
      error.setDevMessage(debugMessage);

      throw error;
    }

    return registerResult;
  }

  static createInitialContext(data: ValidatePaymentRegister) {
    const context = zodSafeParse(pgPaymentInitContextSchema, data);
    return context;
  }

  public async execute(): Promise<UsecaseResult<PaymentUsecaseResultData>> {
    return await withTransaction({
      callback: async () => {
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

        // TODO:: callback 내부라 this 추론이 불가능하므로 타입 캐스팅을 사용 -> refactoring 필요
        const manager = this as PGPaymentManager<PGPaymentContextAfterOrder>;
        return {
          data: {
            approvalDate: manager.context.approvalDate,
            amount: manager.context.amount,
            shopOrderNo: manager.context.shopOrderNo,
          },
          message: '결제가 완료되었습니다.',
        };
      },
      onRollback: async () => {
        // type arssert가 진행되지 않은 상태이기에 unknown 타입으로 먼저 캐스팅 -> 이 시점은 결제가 승인되었다는 전제하에 진행된다.
        const manager = this as unknown as PGPaymentManager<PGPaymentContextAfterOrder>;
        if (manager.context?.pgCno) {
          await cancelPgPaymentAll(manager.context.amount, manager.context.pgCno);
        }
      },
    });
  }

  protected async approvePayment() {
    const approvalRequestDto = PaymentDto.approvePayment(this.context);
    const approvalResult = await paymentsApproval(approvalRequestDto);

    const parsedApprovalResult = approvalPaymentResultSchema.parse(approvalResult);
    return parsedApprovalResult;
  }

  protected applyApprovalResultToContext(
    approvalResult: ApprovalPaymentResult,
  ): asserts this is PGPaymentManager<PGPaymentContextAfterApproval> {
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
  ): asserts this is PGPaymentManager<PGPaymentContextAfterOrder> {
    this.context = {
      ...this.context,
      orderId,
    };
  }

  protected async createOrder(this: PGPaymentManager<PGPaymentContextAfterApproval>) {
    const dto = PaymentDto.createOrderForPG(this.context);
    const order = await createOrderFromEntityLayer(dto);

    return order;
  }

  /**
   * side effect: 주문 상품 생성, 구매 히스토리 생성, 사용 포인트 차감, 구매 포인트 적립
   */
  protected async processOrderList(
    this: PGPaymentManager<PGPaymentContextAfterOrder>,
    usePointTransaction: IPointTransaction<UsePointHistoryDto>,
    earnPointTransaction: IPointTransaction<EarnPointHistoryDto>,
  ) {
    let earnedPoint = 0;

    await Promise.all(
      this.orderList.map(async (orderListItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(orderListItem);
        // step 2. 구매 히스토리 생성
        await this.makeRecentPurchasedHistory(orderListItem);
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

  protected async createPaymentHistory(this: PGPaymentManager<PGPaymentContextAfterOrder>) {
    const dto = PaymentDto.createPaymentHistory(this.context);
    await createPayment(dto);
  }

  private async createOrderProduct(
    this: PGPaymentManager<PGPaymentContextAfterOrder>,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductDto = PaymentDto.createOrderProductForPg(this.context, orderListItem);
    const orderProduct = await createOrderProductFromEntityLayer(orderProductDto);
    return orderProduct;
  }
}
