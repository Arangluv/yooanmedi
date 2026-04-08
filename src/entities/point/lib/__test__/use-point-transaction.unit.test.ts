import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UsePointTransaction } from '../use/point-transaction';
import PointService from '../service';
import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { createPointHistory as createPointHistoryApi } from '../../api/create-history';

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

describe('UsePointTransaction', () => {
  it('initializeContext', async () => {
    const userId = 1;
    const orderProductId = 320;

    const usePointTransaction = new UsePointTransaction({
      userId,
      orderProductId,
    });

    vi.mocked(PointService.findTargetUser).mockResolvedValue({
      id: userId,
      point: 1000,
    });
    vi.mocked(PointService.findTargetOrderProduct).mockResolvedValue({
      id: orderProductId,
    });

    await usePointTransaction.initializeContext();

    expect(PointService.findTargetUser).toHaveBeenCalledWith(1);
    expect(PointService.findTargetOrderProduct).toHaveBeenCalledWith(320);
  });
});

describe('createHistory', () => {
  let usePointTransaction: UsePointTransaction;
  const userId = 1;
  const orderProductId = 320;

  beforeEach(async () => {
    usePointTransaction = new UsePointTransaction({
      userId,
      orderProductId,
    });

    await usePointTransaction.initializeContext();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createHistory는 올바른 파라미터로 호출되어야 한다', async () => {
    const usedPoint = 1000;
    await usePointTransaction.createHistory(usedPoint);

    expect(PointService.createPointHistory).toHaveBeenCalledWith({
      target: { user: userId, orderProduct: orderProductId },
      amount: usedPoint,
      type: POINT_ACTION_TYPE.USE,
    });
  });

  // 현재 취소 시 history를 기반으로 히스토리를 생성하고 있다.
  // 취소 부분 구현 후 테스트 코드 수정 필요
  it.todo('createHistory는 사용포인트가 0인 경우 히스토리를 생성하지 않는다', async () => {
    const usedPoint = 0;
    await usePointTransaction.createHistory(usedPoint);

    expect(PointService.createPointHistory).toHaveBeenCalledTimes(1);
    expect(createPointHistoryApi).not.toHaveBeenCalled();
  });

  it('createHistory는 사용포인트가 0 미만인 경우 예외를 발생시킨다', async () => {
    const usedPoint = -1000;
    await expect(usePointTransaction.createHistory(usedPoint)).rejects.toThrowError();
  });
});

describe('deductUserPoint', () => {
  let usePointTransaction: UsePointTransaction;
  const userId = 1;
  const orderProductId = 320;

  beforeEach(async () => {
    usePointTransaction = new UsePointTransaction({
      userId,
      orderProductId,
    });

    await usePointTransaction.initializeContext();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deductUserPoint는 올바른 파라미터로 호출되어야 한다', async () => {
    const usedPoint = 1000;

    await usePointTransaction.deductUserPoint(usedPoint);

    expect(PointService.updateUserPoint).toHaveBeenCalledWith({
      targetUser: userId,
      willUpdatePoint: 0,
    });
  });

  // 현재 취소 시 history를 기반으로 히스토리를 생성하고 있다.
  // 취소 부분 구현 후 테스트 코드 수정 필요
  it.todo('사용포인트가 0인 경우 deductUserPoint는 호출되지 않는다', async () => {
    const usedPoint = 0;
    await usePointTransaction.deductUserPoint(usedPoint);

    expect(PointService.updateUserPoint).not.toHaveBeenCalled();
  });

  it('사용포인트가 0 미만인 경우 deductUserPoint는 예외를 발생시킨다', async () => {
    const usedPoint = -1000;
    await expect(usePointTransaction.deductUserPoint(usedPoint)).rejects.toThrowError();
  });
});
