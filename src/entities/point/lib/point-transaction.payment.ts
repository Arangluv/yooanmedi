import { PaymentPointTransactionContext } from '../model/schema/point-transaction.schema';
import PointService from './service';

export interface PaymentPointTransactionParams {
  userId: number;
  orderProductId: number;
}

/**
 * 결제 시 적립금 액션을 정의한 클래스
 * 결제 시 적립금 액션 : 상품 구매 시 적립, 포인트 사용
 */
export abstract class PointTransactionBase {
  private params: PaymentPointTransactionParams;
  protected context?: PaymentPointTransactionContext | null;

  abstract createHistory(amount: number): Promise<void>;

  constructor(params: PaymentPointTransactionParams) {
    this.params = params;
  }

  public async initializeContext() {
    const [user, orderProduct] = await Promise.all([
      PointService.findTargetUser(this.params.userId),
      PointService.findTargetOrderProduct(this.params.orderProductId),
    ]);

    // todo :: 삭제
    // const result = zodSafeParse(paymentPointTransactionSchema, {
    //   user,
    //   orderProduct,
    // });

    this.context = {
      user,
      orderProduct,
    };
  }
}
