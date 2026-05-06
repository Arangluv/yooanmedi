import { runWithTransaction, TransactionalCommand } from '@/shared/infrastructure';
import { OrderTransitionContext } from './schemas/transition-context.schema';

export interface IOrderTransitionCommand extends TransactionalCommand<void> {
  execute: () => void;
}

export class OrderTransitionCommand implements IOrderTransitionCommand {
  public readonly context: OrderTransitionContext;

  constructor(context: OrderTransitionContext) {
    this.context = context;
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  public async run() {}
}
