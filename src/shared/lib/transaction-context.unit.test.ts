import { runWithTransaction, TransactionalCommand } from './run-with-transaction';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPayload } from './get-payload';
import { getTransactionContext } from './transaction-context';
import { SystemError } from '@/shared/model/errors/domain.error';

vi.mock('./get-payload', () => ({
  getPayload: vi.fn(),
}));

describe('transactionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTransactionContext이 payload 객체와 transactionID를 반환한다.', async () => {
    vi.mocked(getPayload as any).mockResolvedValue({
      db: {
        rollbackTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        beginTransaction: vi.fn().mockResolvedValue('test-transaction-id-1'),
      },
    });

    const command: TransactionalCommand<void> = {
      run: async () => {
        const { payload, transactionID } = getTransactionContext();
        expect(payload).toBeDefined();
        expect(transactionID).toBeDefined();
      },
    };

    await runWithTransaction(command);
  });

  it('runWithTransaction 외부에서 호출하면 SystemError를 throw한다', () => {
    vi.mocked(getPayload as any).mockResolvedValue({
      db: {
        rollbackTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        beginTransaction: vi.fn().mockResolvedValue('test-transaction-id-1'),
      },
    });

    expect(() => getTransactionContext()).toThrow(SystemError);
  });
});
