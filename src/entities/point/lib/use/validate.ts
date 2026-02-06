import type { User } from '@/entities/user/@x/point';

import { normalizePoint } from '../helper';

interface ValidateUsePointParams {
  user: User;
  amount: number;
}

/**
 * @description 적립금 사용 히스토리 생성을 위한 유효성 검사 함수
 */
export const validateUsePoint = ({ user, amount }: ValidateUsePointParams) => {
  if (amount < 0) {
    throw new Error('사용 적립금은 0 이상이어야 합니다');
  }

  if (amount > normalizePoint(user.point)) {
    throw new Error('사용 적립금은 보유 적립금을 초과할 수 없습니다');
  }
};
