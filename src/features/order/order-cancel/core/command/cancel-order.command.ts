import { TransactionalCommand } from '@/shared';

export type IPartialCancelCommand = TransactionalCommand<void> & {
  execute: () => Promise<void>;
};

export type ITotalCancelCommand = TransactionalCommand<void> & {
  execute: () => Promise<void>;
};
