import { TransactionCommand } from '@/shared/server';

export class TransitionOrderCommand extends TransactionCommand<void> {
  async execute(): Promise<void> {}

  protected async run() {}

  protected async onRollback(): Promise<void> {}
  
}
