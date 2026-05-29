import { BaseError } from '@/shared';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../../constants';

export class PointTransactionError extends BaseError {
  static invalidUpdatePoint(point: number) {
    return new PointTransactionError({
      clientMsg: '적립금을 업데이트하는데 문제가 발생했습니다',
      devMsg: `적립금을 업데이트하는데 문제가 발생했습니다 - 계산결과 : ${point}`,
      errorName: POINT_TRANSACTION_ERROR_MESSAGE.updatePoint,
    });
  }

  static updateUserPointFailed() {
    return new PointTransactionError({
      clientMsg: '적립금을 업데이트하는데 문제가 발생했습니다',
      errorName: POINT_TRANSACTION_ERROR_MESSAGE.updatePoint,
    });
  }

  static createHistoryFailed() {
    return new PointTransactionError({
      clientMsg: POINT_TRANSACTION_ERROR_MESSAGE.create,
      errorName: 'CreatePointTransactionFailError',
    });
  }
}
