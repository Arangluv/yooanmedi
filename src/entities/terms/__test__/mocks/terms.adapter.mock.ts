import { vi } from 'vitest';

export const MockTermsAdapter = () => ({
  getTermsOfUse: vi.fn(),
  getPrivacyPolicy: vi.fn(),
});
