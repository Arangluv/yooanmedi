import { AsyncLocalStorage } from 'async_hooks';
import { TransactionContext, SystemError } from '../../../core';

export const transactionContext = new AsyncLocalStorage<TransactionContext>();

export const getTransactionContext = () => {
  const store = transactionContext.getStore();
  if (!store) {
    const error = new SystemError('시스템 문제가 발생했습니다');
    error.setDevMessage('withTransaction 내부에서 getTransactionContext를 호출해야 합니다.');
    throw error;
  }
  return store;
};
