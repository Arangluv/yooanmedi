import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsePointTransaction } from '../point-transaction';
import { PointTransactionRepository } from '../repository';
import { POINT_ACTION } from '../../constants/point-action';

vi.mock('../repository', () => ({
  PointTransactionRepository: {
    save: vi.fn(),
  },
}));

describe('UsePointTransaction', () => {
  it('PointTransactionRepository의 save 메서드가 호출되어야 한다', async () => {
    vi.mocked(PointTransactionRepository.save).mockResolvedValue({ id: 102 } as any);

    const usePointTransaction = new UsePointTransaction();
    const createHistoryDto = {
      user: 1,
      orderProduct: 1,
      amount: 1000,
    };
    await usePointTransaction.createHistory(createHistoryDto);

    expect(PointTransactionRepository.save).toHaveBeenCalledWith({
      ...createHistoryDto,
      type: POINT_ACTION.USE,
    });
  });

  it('createHistory 후 addHistory 메서드가 호출되어야 한다', async () => {
    vi.mocked(PointTransactionRepository.save).mockResolvedValue({ id: 102 } as any);

    const usePointTransaction = new UsePointTransaction();
    const createHistoryDto = {
      user: 1,
      orderProduct: 1,
      amount: 1000,
    };

    const addHistorySpy = vi.spyOn(usePointTransaction as any, 'addHistory');
    await usePointTransaction.createHistory(createHistoryDto);

    expect(addHistorySpy).toHaveBeenCalledTimes(1);
    expect(addHistorySpy).toHaveBeenCalledWith(102);
  });
});
