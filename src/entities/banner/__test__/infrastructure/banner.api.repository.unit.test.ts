import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { createBannerEntityFixture } from '../fixtures';
import { MockBannerAdapter } from '../mocks';
import { BannerAdapter, BannerApiRepository } from '../../infrastructure';

describe('Banner Api Repository', () => {
  let mockAdapter: ReturnType<typeof BannerAdapter>;

  beforeEach(() => {
    mockAdapter = MockBannerAdapter();
    vi.clearAllMocks();
  });

  describe('getBanner', () => {
    it('배너 데이터를 가져온다', async () => {
      // Given
      const repository = new BannerApiRepository(mockAdapter);
      vi.mocked(mockAdapter.getBanner).mockResolvedValue(
        PayloadAdapterResultManager.ok(createBannerEntityFixture()),
      );

      // When
      await repository.getBanner();

      // Then
      expect(mockAdapter.getBanner).toHaveBeenCalledTimes(1);
    });

    it('실패 시 BaseError를 throw 한다', async () => {
      // Given
      const repository = new BannerApiRepository(mockAdapter);
      vi.mocked(mockAdapter.getBanner).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.getBanner()).rejects.toThrow(BaseError);
    });
  });
});
