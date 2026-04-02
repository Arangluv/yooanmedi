import { getPayload } from '@/shared/lib/get-payload';
import { zodSafeParse } from '@/shared/lib/zod';
import {
  PaymentPointTransactionContext,
  paymentPointTransactionSchema,
} from '../model/point-transaction.schema';

export interface PaymentPointTransactionParams {
  userId: number;
  orderProductId: number;
  amount: number;
}

/**
 * 결제 시 적립금 액션을 정의한 클래스
 * 결제 시 적립금 액션 : 상품 구매 시 적립, 포인트 사용
 */
export abstract class PointTransactionBase {
  private params: PaymentPointTransactionParams;
  protected context: PaymentPointTransactionContext | null;

  abstract createHistory(): Promise<void>;

  constructor(params: PaymentPointTransactionParams) {
    this.params = params;
    this.context = null;
  }

  public async initializeContext() {
    const payload = await getPayload();

    const [user, orderProduct] = await Promise.all([
      payload.findByID({
        collection: 'users',
        id: this.params.userId,
        select: {
          point: true,
        },
      }),
      payload.findByID({
        collection: 'order-product',
        id: this.params.orderProductId,
        select: {},
      }),
    ]);

    const result = zodSafeParse(paymentPointTransactionSchema, {
      user,
      orderProduct,
      amount: this.params.amount,
    });

    this.context = {
      payload,
      ...result,
    };
  }

  public async validate() {}
}
