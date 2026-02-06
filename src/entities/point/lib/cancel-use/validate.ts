import type { PointTransaction } from '../../model/types';

/**
 * @description 사용 적립금이 있는지 없는지에 대한 유효성 검사 함수
 */
export const validateCancelUsePoint = (pointTransaction: Pick<PointTransaction, 'amount'>[]) => {
  if (!pointTransaction || pointTransaction.length === 0) {
    throw new Error('사용된 적립금 내역을 찾을 수 없습니다');
  }
};
