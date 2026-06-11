import { BaseError, FindOption } from '@/shared';
import { POINT_TRANSACTION_ERROR_MESSAGE } from '../../constants';

export class PointHistoryError extends BaseError {
  static invalidUpdatePoint(point: number) {
    return new PointHistoryError({
      clientMsg: '적립금을 업데이트하는데 문제가 발생했습니다',
      devMsg: `적립금을 업데이트하는데 문제가 발생했습니다 - 계산결과 : ${point}`,
      errorName: POINT_TRANSACTION_ERROR_MESSAGE.updatePoint,
    });
  }

  static updateUserPointFailed() {
    return new PointHistoryError({
      clientMsg: '적립금을 업데이트하는데 문제가 발생했습니다',
      errorName: POINT_TRANSACTION_ERROR_MESSAGE.updatePoint,
    });
  }

  static createHistoryFailed() {
    return new PointHistoryError({
      clientMsg: POINT_TRANSACTION_ERROR_MESSAGE.create,
      errorName: 'CreatePointHistoryFailError',
    });
  }

  static invalidFindOption(option: FindOption) {
    return new PointHistoryError({
      clientMsg: POINT_TRANSACTION_ERROR_MESSAGE.fetchFail,
      devMsg: `잘못된 포인트 내역 조회 findOption 파라미터 입니다. \n ${option}`,
      errorName: 'CreatePointHistoryFailError',
    });
  }
}
