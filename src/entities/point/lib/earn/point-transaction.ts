import { PaymentPointTransactionParams, PointTransactionBase } from '../point-transaction.payment';
import { POINT_ACTION } from '../../constants/point-action';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';
import PointService from '../service';

/**구매 시 적립금 적립을 담당하는 클래스 */
export class EarnPointTransaction extends PointTransactionBase {
  constructor(params: PaymentPointTransactionParams) {
    super(params);
  }

  async createHistory(amount: number) {
    if (!this.context) {
      const error = new BusinessLogicError('사용포인트를 차감하는데 문제가 발생했습니다');
      error.setDevMessage('initializeContext 메서드를 호출하지 않았습니다.');

      throw error;
    }

    this.validateAmount(amount);
    const { user, orderProduct } = this.context;

    await PointService.createPointHistory({
      target: { user: user.id, orderProduct: orderProduct.id },
      amount,
      type: POINT_ACTION.EARN,
    });
  }

  async accumulateUserPoint(amount: number) {
    if (!this.context) {
      const error = new BusinessLogicError('사용포인트를 차감하는데 문제가 발생했습니다');
      error.setDevMessage('initializeContext 메서드를 호출하지 않았습니다.');

      throw error;
    }

    this.validateAmount(amount);
    const { user } = this.context;

    const updatedPoint = user.point + amount;
    await PointService.updateUserPoint({ targetUser: user.id, willUpdatePoint: updatedPoint });
  }

  private validateAmount(amount: number) {
    if (amount < 0) {
      const error = new BusinessLogicError('사용포인트를 차감하는데 문제가 발생했습니다');
      error.setDevMessage('사용포인트는 0 이상이어야 합니다');
      throw error;
    }
  }
}
