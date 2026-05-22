import { BasePayload } from 'payload';

export interface TransactionContext {
  transactionID: string | number;
  payload: BasePayload;
}
