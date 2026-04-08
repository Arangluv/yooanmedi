'use server';

import { getPayload } from '@/shared/lib/get-payload';
import { SystemError } from '@/shared/model/errors/domain.error';
import { transactionContext } from './transaction-context';

interface WithTransactionOptions {
  callback: () => Promise<void>;
  onRollback?: (error: unknown) => Promise<void>;
}

export const withTransaction = async <T>({ callback, onRollback }: WithTransactionOptions) => {
  const payload = await getPayload();
  const transactionID = await payload.db.beginTransaction();

  if (!transactionID) {
    const error = new SystemError('시스템 문제가 발생했습니다');
    error.setDevMessage(
      '해당 DB가 트랙젝션을 지원하지 않거나, Adapter가 정상적으로 연결되지 않았습니다',
    );
    throw error;
  }

  try {
    await transactionContext.run({ transactionID, payload }, () => {
      return callback();
    });
    await payload.db.commitTransaction(transactionID);
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    await onRollback?.(error);
    throw error;
  }
};
