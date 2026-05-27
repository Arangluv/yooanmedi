import { describe, it, expect } from 'vitest';
import { TransactionalCommand } from '@/shared/core';
import { PayloadCms } from '@/shared/server/api';
import { getTransactionContextFromStore, runInTransaction } from '../../payload-transaction';

describe('transactionContext', async () => {
  const payload = await PayloadCms.getInstance();

  it('getTransactionContext는 TransactionalCommand 내부에서 transactionId가 포함된 req를 반환한다.', async () => {
    const command: TransactionalCommand<void> = {
      run: async () => {
        const req = getTransactionContextFromStore();
        expect(req).toBeDefined();
        expect(req?.transactionID).toBeDefined();
      },
    };

    await runInTransaction(payload, command);
  });

  it('getTransactionContext는 TransactionalCommand 외부에서 undefined를 반환한다', async () => {
    const req = getTransactionContextFromStore();
    expect(req).not.toBeDefined();
    expect(req?.transactionID).not.toBeDefined();
  });
});
