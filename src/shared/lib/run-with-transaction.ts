import { getPayload } from '@/shared/infrastructure';
import { SystemError } from '@/shared/model/errors/domain.error';
import { transactionContext } from './transaction-context';

export interface TransactionalCommand<T> {
  run(): Promise<T>;
  onRollback?(): Promise<void>;
}

export const runWithTransaction = async <T>(command: TransactionalCommand<T>): Promise<T> => {
  const payload = await getPayload();
  const transactionID = await payload.db.beginTransaction();

  if (!transactionID) {
    const error = new SystemError('시스템 문제가 발생했습니다');
    error.setDevMessage(
      '해당 DB가 트랜젝션을 지원하지 않거나, Adapter가 정상적으로 연결되지 않았습니다',
    );
    throw error;
  }

  try {
    const result = await transactionContext.run({ transactionID, payload }, () => command.run());
    await payload.db.commitTransaction(transactionID);
    return result;
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    await command.onRollback?.();
    throw error;
  }
};
