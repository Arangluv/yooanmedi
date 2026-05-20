import { type TransactionalCommand } from '@/shared/infrastructure';

export type IPartialCancelCommand = TransactionalCommand<void> & {
  execute: () => Promise<void>;
};

export type ITotalCancelCommand = TransactionalCommand<void> & {
  execute: () => Promise<void>;
};
