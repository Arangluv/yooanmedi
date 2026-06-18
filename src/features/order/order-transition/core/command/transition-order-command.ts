import { TransactionalCommand } from '@/shared';

export interface TransitionOrderCommandResult {
  message: string;
}

export interface TransitionOrderCommand
  extends TransactionalCommand<TransitionOrderCommandResult> {}
