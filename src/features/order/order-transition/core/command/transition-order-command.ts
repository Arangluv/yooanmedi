import { TransactionalCommand } from '@/shared';

export interface ITransitionOrderCommand extends TransactionalCommand<void> {
  execute: () => void;
}
