import { PGOrderPaymentsService } from './pg.service';
import { BankTransferOrderPaymentsService } from './bank-transfer.service';
import { PAYMENTS_METHOD, PaymentsMethod } from '../../constants/payments-method';
import { BusinessLogicError } from '@/shared';

export class OrderPaymentsService {
  public static for(paymentsMethod: PaymentsMethod) {
    switch (paymentsMethod) {
      case PAYMENTS_METHOD.credit_card:
        return new PGOrderPaymentsService();
      case PAYMENTS_METHOD.bank_transfer:
        return new BankTransferOrderPaymentsService();
      default:
        const error = new BusinessLogicError('주문을 처리하는데 문제가 발생했습니다');
        error.setDevMessage('지정된 결제방식이 아닙니다.');
        throw error;
    }
  }
}
