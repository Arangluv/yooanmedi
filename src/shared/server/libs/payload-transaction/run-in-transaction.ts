// todo:: will remove

import { BasePayload } from 'payload';
import { TransactionContext, transactionStorage } from './transaction-context';
import { SystemError, TransactionalCommand } from '@/shared/core';

export const runInTransaction = async <T>(
  payload: BasePayload,
  command: TransactionalCommand<T>,
): Promise<T> => {
  const transactionID = await payload.db.beginTransaction();
  if (!transactionID) {
    const error = new SystemError('시스템 문제가 발생했습니다');
    error.setDevMessage(
      '해당 DB가 트랜젝션을 지원하지 않거나, Adapter가 정상적으로 연결되지 않았습니다',
    );
    throw error;
  }

  const req = { transactionID } as TransactionContext['req'];

  try {
    const result = await transactionStorage.run({ req }, () => command.run());
    await payload.db.commitTransaction(transactionID);
    return result;
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    await command.onRollback?.();
    throw error;
  }
};
