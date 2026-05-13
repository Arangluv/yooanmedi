import { Order } from '@/entities/order';
import { BusinessLogicError, PAYMENTS_METHOD } from '@/shared';
import { ITotalCancelCommand } from './cancel-command';
import { PGTotalCancelCommand } from './pg/total-cancel-command';
import { BankTransferTotalCancelCommand } from './bank-transfer/total-cancel-command';

export class AdminOrderTotalCancelCommandFactory {
  public static createCommand(order: Order): ITotalCancelCommand {
    switch (order.paymentsMethod) {
      case PAYMENTS_METHOD.credit_card:
        return new PGTotalCancelCommand(order);
      case PAYMENTS_METHOD.bank_transfer:
        return new BankTransferTotalCancelCommand(order);
      default:
        const error = new BusinessLogicError('주문상품을 취소하는데 문제가 발생했습니다');
        error.setDevMessage('올바르지 않은 취소 strategy 입니다');
        throw error;
    }
  }
}
