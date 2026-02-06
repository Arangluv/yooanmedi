import type { PointTransaction } from '../../model/types';

/**
 * @description 적립금이 적립된 거래내역이 있는지에 대한 유효성 검사 함수
 */
export const validateCancelEarnPoint = (pointTransaction: Pick<PointTransaction, 'amount'>[]) => {
  if (!pointTransaction || pointTransaction.length === 0) {
    throw new Error('적립금 취소 거래 내역을 찾을 수 없습니다');
  }
};
