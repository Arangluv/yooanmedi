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

    await expect(withTransaction({ callback: () => Promise.resolve() })).rejects.toThrowError(
      SystemError,
    );
  });

  it('callback 함수 성공 시 db.commitTransaction 함수가 호출되어야 한다', async () => {
    const payload = await getPayload();
    await withTransaction({ callback: () => Promise.resolve() });

    expect(payload.db.commitTransaction).toHaveBeenCalled();
    expect(payload.db.rollbackTransaction).not.toHaveBeenCalled();
  });

  it('callback 함수에서 error를 throw하지 않으면 catch 블록에서 error는 undefined다', async () => {
    try {
      await withTransaction({ callback: () => Promise.reject() });
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('callback 함수가 Promise.reject를 반환하면 db.rollbackTransaction 함수가 호출되어야 한다', async () => {
    const payload = await getPayload();

    try {
      await withTransaction({ callback: () => Promise.reject() });
    } catch (error) {
      expect(payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(payload.db.commitTransaction).not.toHaveBeenCalled();
    }
  });

  it('callback 함수가 throw를 발생시키면 Error를 throw하고 db.rollbackTransaction 함수가 호출되어야 한다', async () => {
    const payload = await getPayload();

    try {
      await withTransaction({
        callback: () => {
          const error = new SystemError('system error');
          error.setDevMessage('시스템 문제가 발생했습니다');
          throw error;
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
      expect(payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(payload.db.commitTransaction).not.toHaveBeenCalled();
    }
  });

  it('callback 함수가 Promise.reject를 반환하고 onRollback 함수가 정의되어 있다면 onRollback 함수가 호출되어야 한다', async () => {
    const onRollbackMock = vi.fn();

    try {
      await withTransaction({
        callback: () => Promise.reject(),
        onRollback: async (error) => {
          onRollbackMock(error);
        },
      });
    } catch (error) {
      expect(onRollbackMock).toHaveBeenCalled();
    }
  });

  it('callback 함수가 throw를 발생시키고 onRollback 함수가 정의되어 있다면 onRollback 함수가 호출되어야 한다', async () => {
    const onRollbackMock = vi.fn();

    try {
      await withTransaction({
        callback: () => {
          throw new Error('test error');
        },
        onRollback: async (error) => {
          onRollbackMock(error);
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(onRollbackMock).toHaveBeenCalled();
    }
  });

  it('rollback에서 throw한 error는 최상단 catch 블록에서 처리되어야 한다', async () => {
    try {
      await withTransaction({
        callback: async () => {
          throw new Error('callback error');
        },
        onRollback: async (error) => {
          throw new SystemError('rollback error');
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(SystemError);
    }
  });
});
