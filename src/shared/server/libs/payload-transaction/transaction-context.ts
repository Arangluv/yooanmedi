import { PayloadRequest } from 'payload';
import { AsyncLocalStorage } from 'async_hooks';

export type TransactionContext = {
  req: Partial<PayloadRequest> & { transactionID: string | number };
};

export const transactionStorage = new AsyncLocalStorage<TransactionContext>();

export const getTransactionContextFromStore = (): TransactionContext['req'] | undefined => {
  return transactionStorage.getStore()?.req;
};
