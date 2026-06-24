import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockCustomPriceAdapter } from '../mocks';
import { CustomPriceApiRepository } from '../../infrastructure/api';
import { CustomPriceAdapter } from '../../infrastructure/adapter';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { createCustomPriceEntityFixture } from '../fixtures';

describe('Custom Price Api Repository', () => {
  let mockAdapter: ReturnType<typeof CustomPriceAdapter>;
  let repository: CustomPriceApiRepository;

  beforeEach(() => {
    mockAdapter = MockCustomPriceAdapter();
    repository = new CustomPriceApiRepository(mockAdapter);
  });

  describe('findMany', () => {
    it('개별가격 설정 데이터 조회에 성공한다', async () => {
      // Given
      const option = { pagination: false, limit: 3 } as FindOption;
      vi.mocked(mockAdapter.getCustomPrices).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createCustomPriceEntityFixture({ id: 1 }),
          createCustomPriceEntityFixture({ id: 2 }),
        ]),
      );

      // When
      const result = await repository.findMany(option);

      // Then
      expect(mockAdapter.getCustomPrices).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getCustomPrices).toHaveBeenCalledWith(option);
      expect(result.length).toBe(2);
    });

    it('개별가격 설정 데이터 조회 실패시 BaseError를 throw한다', async () => {
      // Given
      const option = { pagination: false, limit: 3 } as FindOption;
      vi.mocked(mockAdapter.getCustomPrices).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findMany(option)).rejects.toThrow(BaseError);
    });
  });
});
