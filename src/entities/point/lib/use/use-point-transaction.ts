import { PaymentPointTransactionParams, PointTransactionBase } from '../point-transaction.payment';
import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';

export class UsePointTransaction extends PointTransactionBase {
  constructor(params: PaymentPointTransactionParams) {
    super(params);
  }

  async validate() {}

  async createHistory(this: UsePointTransaction) {
    if (!this.context) {
      const error = new BusinessLogicError('결제에 문제가 발생했습니다.');
      error.setDevMessage('initializeContext 메서드를 호출하지 않았습니다.');

      throw error;
    }

    const { payload, user, orderProduct, amount } = this.context;

    await payload.create({
      collection: 'point-transaction',
      data: {
        user: user.id,
        orderProduct: orderProduct.id,
        type: POINT_ACTION_TYPE.USE,
        reason: `적립금 사용 - 주문 상품 아이디 : ${orderProduct.id}`,
        amount: amount,
      },
    });
  }

  async deductUserPoint() {
    if (!this.context) {
      const error = new BusinessLogicError('결제에 문제가 발생했습니다.');
      error.setDevMessage('initializeContext 메서드를 호출하지 않았습니다.');

      throw error;
    }

    const { payload, user, amount } = this.context;
    const updatedPoint = user.point - amount;

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        point: updatedPoint,
      },
    });
  }
}
