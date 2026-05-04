import { PGOrderService } from './pg.service';
import { BankTransferOrderService } from './bank-transfer.service';
import { PAYMENTS_METHOD, PaymentsMethod } from '../../constants/payments-method';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';

export class OrderService {
  public static for(paymentsMethod: PaymentsMethod) {
    switch (paymentsMethod) {
      case PAYMENTS_METHOD.credit_card:
        return new PGOrderService();
      case PAYMENTS_METHOD.bank_transfer:
        return new BankTransferOrderService();
      default:
        const error = new BusinessLogicError('주문을 처리하는데 문제가 발생했습니다');
        error.setDevMessage('지정된 결제방식이 아닙니다.');
        throw error;
    }
  }
}
