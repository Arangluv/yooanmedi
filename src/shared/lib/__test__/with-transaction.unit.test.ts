import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withTransaction } from '../with-transaction';
import { getPayload } from '../get-payload';
import { SystemError } from '@/shared/model/errors/domain.error';

vi.mock('../get-payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    db: {
      beginTransaction: vi.fn().mockResolvedValue('test-transaction-id'),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
    },
  }),
}));

describe('withTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('transactionID가 없다면 SystemError를 throw한다.', async () => {
    vi.mocked(getPayload).mockResolvedValueOnce({
      db: {
        beginTransaction: vi.fn().mockResolvedValue(null),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
      },
    } as any);

    await expect(withTransaction(() => Promise.resolve())).rejects.toThrowError(SystemError);
  });

  it('callback 함수 성공 시 db.commitTransaction 함수가 호출되어야 한다', async () => {
    await withTransaction(() => Promise.resolve());
    const payload = await getPayload();

    expect(payload.db.commitTransaction).toHaveBeenCalled();
    expect(payload.db.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('callback 함수가 Promise.reject를 반환하면 Error를 throw하고 db.rollbackTransaction 함수가 호출되어야 한다', async () => {
    const payload = await getPayload();

    try {
      await withTransaction(() => Promise.reject(new Error('test error')));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(payload.db.commitTransaction).not.toHaveBeenCalled();
    }
  });

  it('callback 함수가 throw를 발생시키면 Error를 throw하고 db.rollbackTransaction 함수가 호출되어야 한다', async () => {
    const payload = await getPayload();

    try {
      await withTransaction(() => {
        throw new Error('test error');
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(payload.db.commitTransaction).not.toHaveBeenCalled();
    }
  });
});
