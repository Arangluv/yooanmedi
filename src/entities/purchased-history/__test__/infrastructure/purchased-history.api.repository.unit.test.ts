import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockPurchasedHistoryAdapter } from '../mocks';
import { createPurchasedHistoryEntityFixture } from '../fixtures';
import { PurchasedHistoryApiRepository, PurchasedHistoryAdapter } from '../../infrastructure';
import { CreatePurchasedHistoryRequestDto } from '../../dto';
import { purchasedHistoriesSchema } from '../../schemas';

describe('Purchased History Api Repository', () => {
  let mockPurchasedHistoryAdapter: ReturnType<typeof PurchasedHistoryAdapter>;
  let purchasedHistoryRepository: PurchasedHistoryApiRepository;

  beforeEach(() => {
    mockPurchasedHistoryAdapter = MockPurchasedHistoryAdapter();
    purchasedHistoryRepository = new PurchasedHistoryApiRepository(mockPurchasedHistoryAdapter);
  });

  describe('create', () => {
    it('최근 주문내역 생성에 성공한다', async () => {
      // Given
      const dto = { user: 1, product: 3, quantity: 5, amount: 1200 } as CreatePurchasedHistoryRequestDto;
      vi.mocked(mockPurchasedHistoryAdapter.createPurchasedHistory).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPurchasedHistoryEntityFixture()),
      );

      // When
      const result = await purchasedHistoryRepository.create(dto);

      // Then
      expect(mockPurchasedHistoryAdapter.createPurchasedHistory).toHaveBeenCalledTimes(1);
      expect(mockPurchasedHistoryAdapter.createPurchasedHistory).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });

    it('최근 주문내역 생성에 실패시 BaseError를 throw한다', async () => {
      // Given
      const dto = { user: 1, product: 3, quantity: 5, amount: 1200 } as CreatePurchasedHistoryRequestDto;
      vi.mocked(mockPurchasedHistoryAdapter.createPurchasedHistory).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When
      await expect(() => purchasedHistoryRepository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('최근 주문내역을 가져오는데 성공한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockPurchasedHistoryAdapter.getPurchasedHistories).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createPurchasedHistoryEntityFixture({ id: 1 }),
          createPurchasedHistoryEntityFixture({ id: 2 }),
          createPurchasedHistoryEntityFixture({ id: 3 }),
        ]),
      );

      // When
      const result = await purchasedHistoryRepository.findMany(option);

      // Then
      expect(mockPurchasedHistoryAdapter.getPurchasedHistories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.schemaMatching(purchasedHistoriesSchema));
    });

    it('최근 주문내역을 가져오는데 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockPurchasedHistoryAdapter.getPurchasedHistories).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => purchasedHistoryRepository.findMany(option)).rejects.toThrow(BaseError);
    });
  });
});
