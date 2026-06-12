import { cancelPgPaymentAll } from '@/entities/payment'; // todo :: remove
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import {
  PaymentHistoryApiRepository,
  PaymentHistoryAdapter,
} from '@/entities/payment/infrastructure';
import { EasyPayRepository } from '@/entities/easypay';
import { EasyPayAdapter, EasyPayApiRepository } from '@/entities/easypay/infrastructure';
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
import { PaymentContextFactory, PGContextFactory } from '../context.factory';
import {
  PGPaymentAfterApprovalContext,
  PGPaymentAfterOrderContext,
  PGPaymentInitContext,
} from '../schemas/payments-context/pg.schema';
import { PointCalculator, PointHistory } from '@/entities/point';
import { PaymentsMapper } from '../../mapper';
import { POINT_ACTION } from '@/entities/point';
import { PointHistoryRepository } from '@/entities/point';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserRepository } from '@/entities/user';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { EasyPayMapper } from '@/entities/easypay/mapper';

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
  private pointRepository: PointHistoryRepository;
  private userRepository: UserRepository;
  private easyPayRepository: EasyPayRepository;

  public constructor(requestDto: FormData) {
    this.requestDto = requestDto;
    this.context = null;
    this.easyPayRepository = new EasyPayApiRepository(EasyPayAdapter());
    this.pointRepository = new PointHistoryApiRepository(PointHistoryAdapter());
    this.userRepository = new UserApiRepository(UserAdapter());
  }

  public async run(): Promise<PGPaymentCommandResult> {
    const contextFactory = new PGContextFactory();
    const initCtx = await this.initializeContext(contextFactory);

    // step 1. 결제승인 요청 --> 나중액션으로 빠져야하고
    // easypay return값과 결과값이 다르면 rollback 시켜야함

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
      await cancelPgPaymentAll({ amount: this.context.amount, pgCno: this.context.pgCno });
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

  // API Handler로 이동 -> ok
  private refineEasypayRegisterResult() {
    let data = {} as any;
    this.requestDto.forEach((value: any, key: string) => {
      data[key as string] = value;
    });

    return EasyPayMapper.toAuthenticationDto(data);
  }

  private async approvePayment(ctx: PGPaymentInitContext) {
    const dto = PaymentDto.approvePayment(ctx);
    const approvalResult = await this.easyPayRepository.approvePayment(dto);

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
    const orderRepository = new OrderApiRepository(OrderAdapter());
    const dto = PaymentDto.createOrderForPG(ctx);
    const order = await orderRepository.create(dto);

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
    const usePointHistoryStack = [] as PointHistory[];
    const earnPointHistoryStack = [] as PointHistory[];

    await Promise.all(
      ctx.orderList.map(async (orderListItem) => {
        // step 1. 주문 상품 생성
        const orderProduct = await this.createOrderProduct(ctx, orderListItem);
        // step 2. 구매 히스토리 생성
        await this.createRecentPurchasedHistory(ctx, orderListItem);
        // step 3-1. 사용 포인트 차감 히스토리 생성
        const usePointHistory = await this.pointRepository.createUsageHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: orderListItem.calculatedUsedPoint,
          type: POINT_ACTION.use,
        });
        usePointHistoryStack.push(usePointHistory);
        // step 3-2. 사용 포인트 차감 히스토리 push

        // step 4-1. 구매 포인트 적립 히스토리 생성
        const pointItem = PaymentsMapper.orderListItemToPointItem(orderListItem);
        const willEarnPoint = PointCalculator.forCardWithQuantity(pointItem);
        const earnPointHistory = await this.pointRepository.createUsageHistory({
          user: ctx.userId,
          orderProduct: orderProduct.id,
          amount: willEarnPoint,
          type: POINT_ACTION.earn,
        });
        // step 4-2. 구매 포인트 적립 히스토리 push
        earnPointHistoryStack.push(earnPointHistory);
      }),
    );

    // step 5. 구매 포인트 적립
    await this.earnPoint(earnPointHistoryStack, ctx);

    // step 6. 사용 포인트 차감
    await this.usePoint(usePointHistoryStack, ctx);
  }

  private async earnPoint(stack: PointHistory[], ctx: PGPaymentAfterOrderContext) {
    const user = await this.userRepository.findById(ctx.userId);
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistories(stack),
      action: POINT_ACTION.earn,
    });
    await this.userRepository.update({
      user: ctx.userId,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async usePoint(stack: PointHistory[], ctx: PGPaymentAfterOrderContext) {
    const user = await this.userRepository.findById(ctx.userId);
    const updatedPoint = PointCalculator.getUpdatePoint({
      current: user.point,
      delta: PointCalculator.getDeltaPointByHistories(stack),
      action: POINT_ACTION.use,
    });
    await this.userRepository.update({
      user: ctx.userId,
      data: {
        point: updatedPoint,
      },
    });
  }

  private async createOrderProduct(
    ctx: PGPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ) {
    const orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    const requestDto = PaymentDto.createOrderProductForPg(ctx, orderListItem);
    const orderProduct = await orderProductRepository.create(requestDto);

    return orderProduct;
  }

  private async createRecentPurchasedHistory(
    ctx: PGPaymentAfterOrderContext,
    orderListItem: EnrichedOrderListItem,
  ): Promise<void> {
    const purchasedHistoryRepository = new PurchasedHistoryApiRepository(PurchasedHistoryAdapter());
    const dto = PaymentDto.createRecentPurchasedHistory(ctx, orderListItem);
    await purchasedHistoryRepository.create(dto);
  }

  private async createPaymentHistory(ctx: PGPaymentAfterOrderContext) {
    const paymentHistoryRepository = new PaymentHistoryApiRepository(PaymentHistoryAdapter());
    const dto = PaymentDto.createPaymentHistory(ctx);
    await paymentHistoryRepository.create(dto);
  }
}
