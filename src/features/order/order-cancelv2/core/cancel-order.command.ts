import { TransactionalCommand } from '@/shared';

export type PartialCancelCommand = TransactionalCommand<void> & {
  execute: () => Promise<void>;
};

export type TotalCancelCommand = TransactionalCommand<void> & {
  execute: () => Promise<void>;
};
