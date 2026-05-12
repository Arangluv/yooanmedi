import { runWithTransaction } from '@/shared/infrastructure';
import { ITotalCancelCommand } from '../cancel-command';

export class BankTransferTotalCancelCommand implements ITotalCancelCommand {
  // 취소 요청을 포함하여 모든 order-product의 상태를 바꾸며 order도 바꿈
  public async run() {
    
  }

  public async execute() {
    return await runWithTransaction(this);
  }
}
