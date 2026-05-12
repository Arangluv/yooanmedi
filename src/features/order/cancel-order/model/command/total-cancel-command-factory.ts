import { Order, ORDER_STATUS } from '@/entities/order';
import { OrderProduct } from '@/entities/order-product';
import { BusinessLogicError, PAYMENTS_METHOD } from '@/shared';
import { ITotalCancelCommand } from './cancel-command';
import { PGTotalCancelCommand } from './pg/total-cancel-command';
import { BankTransferTotalCancelCommand } from './bank-transfer/total-cancel-command';

export interface CreateTotalOrderCancelCommandDto {
  order: Order;
  orderProduct: OrderProduct;
}

export class TotalOrderCancelCommandFactory {
  public static createCommand(dto: CreateTotalOrderCancelCommandDto): ITotalCancelCommand {
    switch (dto.order.paymentsMethod) {
      case PAYMENTS_METHOD.credit_card:
        return new PGTotalCancelCommand();
      case PAYMENTS_METHOD.bank_transfer:
        return new BankTransferTotalCancelCommand();
      default:
        const error = new BusinessLogicError('주문상품을 취소하는데 문제가 발생했습니다');
        error.setDevMessage('올바르지 않은 취소 strategy 입니다');
        throw error;
    }
  }
}
