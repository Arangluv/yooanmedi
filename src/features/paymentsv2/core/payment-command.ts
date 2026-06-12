import { TransactionalCommand } from '@/shared';

export interface PaymentCommand<TResult> extends TransactionalCommand<TResult> {
  execute: () => Promise<TResult>;
}
