import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockPopupAdapter } from '../mocks';
import { PopupFixtures } from '../fixtures';
import { PopupApiRepository, PopupAdapter } from '../../infrastructure';

describe('PopupApiRepository', () => {
  let mockAdapter: ReturnType<typeof PopupAdapter>;
  let repository: PopupApiRepository;

  beforeEach(() => {
    mockAdapter = MockPopupAdapter();
    repository = new PopupApiRepository(mockAdapter);
  });

  describe('getPopup', () => {
    it('팝업 데이터를 가져온다', async () => {
      // Given
      vi.mocked(mockAdapter.getPopup).mockResolvedValue(
        PayloadAdapterResultManager.ok(PopupFixtures.entity),
      );

      // When
      await repository.getPopup();

      // Then
      expect(mockAdapter.getPopup).toHaveBeenCalledTimes(1);
    });

    it('팝업 데이터를 가져오는데 실패하면 BaseError를 thorw한다', async () => {
      // Given
      vi.mocked(mockAdapter.getPopup).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.getPopup()).rejects.toThrow(BaseError);
    });
  });
});
