import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockMetaSettingAdapter } from '../mocks';
import { createMetaSettingEntityFixture } from '../fixtures';
import { MetaSettingApiRepository, MetaSettingAdapter } from '../../infrastructure';

describe('MetaSetting Api Repository', () => {
  let mockAdapter: ReturnType<typeof MetaSettingAdapter>;
  let repository: MetaSettingApiRepository;

  beforeEach(() => {
    mockAdapter = MockMetaSettingAdapter();
    repository = new MetaSettingApiRepository(mockAdapter);
    vi.clearAllMocks();
  });

  describe('getSiteMetaSetting', () => {
    it('사이트 메타데이터를 가져온다', async () => {
      // Given
      vi.mocked(mockAdapter.getSiteMetaSetting).mockResolvedValue(
        PayloadAdapterResultManager.ok(createMetaSettingEntityFixture()),
      );

      // When
      await repository.getSiteMetaSetting();

      // Then
      expect(mockAdapter.getSiteMetaSetting).toHaveBeenCalledTimes(1);
    });

    it('실패 시 BaseError를 throw한다', async () => {
      // Given
      vi.mocked(mockAdapter.getSiteMetaSetting).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.getSiteMetaSetting()).rejects.toThrow(BaseError);
    });
  });
});
