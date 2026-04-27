import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecentPurchasedHistoryService } from '../recent-purchased-history.service';
import { RecentPurchasedHistoryRepository } from '../../api/recent-purchased-history.repository';

vi.mock('../../api/recent-purchased-history.repository', () => ({
  RecentPurchasedHistoryRepository: {
    create: vi.fn(),
    getList: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('RecentPurchasedHistoryService', () => {
  describe('createRecentPurchasedHistory', () => {
    const service = new RecentPurchasedHistoryService();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('최근 구매내역을 생성한다', async () => {
      vi.mocked(RecentPurchasedHistoryRepository.getList).mockResolvedValue([]);
      vi.mocked(RecentPurchasedHistoryRepository.create).mockResolvedValue();

      const dto = {
        user: 1,
        product: 100,
        quantity: 2,
        amount: 1000,
      };
      await service.createHistory(dto);

      expect(RecentPurchasedHistoryRepository.getList).toHaveBeenCalledTimes(0); // todo :: 해당 부분 수정 -> 최대 3개만 유지하기 위해 적어두었었음
      expect(RecentPurchasedHistoryRepository.create).toHaveBeenCalledTimes(1);
      expect(RecentPurchasedHistoryRepository.create).toHaveBeenCalledWith(dto);
    });

    it.todo('최근 구매내역이 3개 이상일 경우, 가장 최근의 구매내역 2개만 남기고 나머지는 삭제한다');
  });

  describe('getList', async () => {
    const service = new RecentPurchasedHistoryService();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('최근 구매내역을 조회한다', async () => {
      vi.mocked(RecentPurchasedHistoryRepository.getList).mockResolvedValue([
        { id: 1, quantity: 1, amount: 1000, createdAt: new Date().toISOString() },
        { id: 2, quantity: 2, amount: 2000, createdAt: new Date().toISOString() },
        { id: 3, quantity: 3, amount: 3000, createdAt: new Date().toISOString() },
      ]);

      const list = await service.getList({
        userId: 1,
        productId: 100,
      });

      expect(list).toHaveLength(3);
      expect(RecentPurchasedHistoryRepository.getList).toHaveBeenCalledTimes(1);
    });
  });
});
