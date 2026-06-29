import { vi } from 'vitest';

export const MockMetaSettingAdapter = () => ({
  getSiteMetaSetting: vi.fn(),
});
