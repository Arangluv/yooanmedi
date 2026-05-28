import { BaseError } from '@/shared';

export class PointTransactionError extends BaseError {
  static invalidUpdatePoint(point: number) {
    return new PointTransactionError({
      clientMsg: '적립금을 업데이트하는데 문제가 발생했습니다',
      devMsg: `적립금을 업데이트하는데 문제가 발생했습니다 - 계산결과 : ${point}`,
      errorName: 'InvalidUpdatePointError',
    });
  }

  static updateUserPointFailed() {
    return new PointTransactionError({
      clientMsg: '적립금을 업데이트하는데 문제가 발생했습니다',
      errorName: 'PointUpdateFailError',
    });
  }

  static createHistoryFailed() {
    return new PointTransactionError({
      clientMsg: '적립금 내역을 생성하는데 문제가 발생했습니다',
      errorName: 'CreatePointTransactionFailError',
    });
  }
}
