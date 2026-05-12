import { runWithTransaction } from '@/shared/infrastructure';
import { ITotalCancelCommand } from '../cancel-command';

export class PGTotalCancelCommand implements ITotalCancelCommand {
  // 1. 즉시 취소
  public async run() {}

  public async execute() {
    return await runWithTransaction(this);
  }
}
