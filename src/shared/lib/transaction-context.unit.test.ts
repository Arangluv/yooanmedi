import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withTransaction } from './with-transaction';
import { getPayload } from './get-payload';
import { getTransactionContext } from './transaction-context';
import { SystemError } from '@/shared/model/errors/domain.error';

vi.mock('../get-payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    db: {
      beginTransaction: vi
        .fn()
        .mockResolvedValueOnce('test-transaction-id-1')
        .mockResolvedValue('test-transaction-id-2'),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
    },
  }),
}));

describe('transactionContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTransactionContext은 withTransaction 내부에서 호출되어야 한다', async () => {
    await withTransaction({
      callback: async () => {
        const { payload, transactionID } = getTransactionContext();

        expect(payload).toBeDefined();
        expect(transactionID).toBe('test-transaction-id-1');
      },
    });
  });

  it('getTransactionContext은 withTransaction 내부에서 호출되지 않으면 SystemError를 throw한다', async () => {
    expect(getTransactionContext).toThrowError(SystemError);
  });

  it('함수 호출마다 새로운 컨텍스트를 생성한다', async () => {
    const randomTransactionID = Math.random().toString(36).substring(2, 15);
    const randomTransactionID2 = Math.random().toString(36).substring(2, 15);

    // getPayload는 항상 같은 db 인스턴스를 반환해야 체인이 이어짐
    const mockBeginTransaction = vi
      .fn()
      .mockResolvedValueOnce(randomTransactionID)
      .mockResolvedValueOnce(randomTransactionID2);

    vi.mocked(getPayload).mockResolvedValue({
      db: {
        beginTransaction: mockBeginTransaction,
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    } as any);

    await withTransaction({
      callback: async () => {
        const { transactionID } = getTransactionContext();
        expect(transactionID).toBe(randomTransactionID);
      },
    });

    await withTransaction({
      callback: async () => {
        const { transactionID } = getTransactionContext();
        expect(transactionID).toBe(randomTransactionID2);
      },
    });
  });
});
