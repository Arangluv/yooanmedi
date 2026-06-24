import { vi } from 'vitest';

export const MockEasyPayAdapter = () => ({
  registerTransaction: vi.fn(),
  approvePayment: vi.fn(),
  cancelPayment: vi.fn(),
});
