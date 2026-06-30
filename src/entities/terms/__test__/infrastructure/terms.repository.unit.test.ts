import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockTermsAdapter } from '../mocks';
import { TermsFixtures } from '../fixtures';
import { TermsApiRepository, TermsAdapter } from '../../infrastructure';

describe('Terms Api Repository', () => {
  let mockAdapter: ReturnType<typeof TermsAdapter>;
  let repository: TermsApiRepository;

  beforeEach(() => {
    mockAdapter = MockTermsAdapter();
    repository = new TermsApiRepository(mockAdapter);
  });

  it('이용약관, 개인정보처리방침 데이터를 가져온다', async () => {
    // Given
    vi.mocked(mockAdapter.getTermsOfUse).mockResolvedValue(
      PayloadAdapterResultManager.ok(TermsFixtures.entity),
    );
    vi.mocked(mockAdapter.getPrivacyPolicy).mockResolvedValue(
      PayloadAdapterResultManager.ok(TermsFixtures.entity),
    );

    // When
    await repository.getTermsOfUse();
    await repository.getPrivacyPolicy();

    // Then
    expect(mockAdapter.getTermsOfUse).toHaveBeenCalledTimes(1);
    expect(mockAdapter.getPrivacyPolicy).toHaveBeenCalledTimes(1);
  });

  it('이용약관, 개인정보처리방침 데이터를 가져오는데 실패하면 BaseError를 throw한다', async () => {
    // Given
    vi.mocked(mockAdapter.getTermsOfUse).mockResolvedValue(
      PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
    );
    vi.mocked(mockAdapter.getPrivacyPolicy).mockResolvedValue(
      PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
    );

    // When & Then
    await expect(() => repository.getTermsOfUse()).rejects.toThrow(BaseError);
    await expect(() => repository.getPrivacyPolicy()).rejects.toThrow(BaseError);
  });
});
