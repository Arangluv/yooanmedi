import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EarnPointTransaction } from '../earn/point-transaction';
import PointService from '../service';

vi.mock('../service', () => ({
  default: {
    findTargetUser: vi.fn().mockResolvedValue({
      id: 1,
      point: 1000,
    }),
    findTargetOrderProduct: vi.fn().mockResolvedValue({
      id: 320,
    }),
    createPointHistory: vi.fn(),
    updateUserPoint: vi.fn(),
  },
}));

vi.mock('../../api/create-history', () => ({
  createPointHistory: vi.fn(),
}));

vi.mock('../../api/update', () => ({
  updateUserPoint: vi.fn(),
}));

describe('deductUserPoint', () => {
  let usePointTransaction: EarnPointTransaction;
  const userId = 1;
  const orderProductId = 320;

  beforeEach(async () => {
    usePointTransaction = new EarnPointTransaction({
      userId,
      orderProductId,
    });

    await usePointTransaction.initializeContext();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('accumulateUserPoint는 올바른 파라미터로 호출되어야 한다', async () => {
    const accumulatedPoint = 32;
    await usePointTransaction.accumulateUserPoint(accumulatedPoint);

    expect(PointService.updateUserPoint).toHaveBeenCalledWith({
      targetUser: userId,
      willUpdatePoint: 1032,
    });
  });

  // 현재 취소 시 history를 기반으로 히스토리를 생성하고 있다.
  // 취소 부분 구현 후 테스트 코드 수정 필요
  it.todo('적립금이 0인 경우 accumulateUserPoint는 호출되지 않는다', async () => {
    const accumulatedPoint = 0;
    await usePointTransaction.accumulateUserPoint(accumulatedPoint);

    expect(PointService.updateUserPoint).not.toHaveBeenCalled();
  });

  it('적립금이 0 미만인 경우 accumulateUserPoint는 예외를 발생시킨다', async () => {
    const accumulatedPoint = -1000;
    await expect(usePointTransaction.accumulateUserPoint(accumulatedPoint)).rejects.toThrowError();
  });
});
