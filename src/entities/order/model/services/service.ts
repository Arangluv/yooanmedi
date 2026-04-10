import { PGOrderService } from './pg.service';
import { BankTransferOrderService } from './bank-transfer.service';
import { PAYMENTS_METHOD, PaymentsMethod } from '../../constants/payments-options';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';

export class OrderService {
  public static for(paymentsMethod: PaymentsMethod) {
    switch (paymentsMethod) {
      case PAYMENTS_METHOD.CREDIT_CARD:
        return new PGOrderService();
      case PAYMENTS_METHOD.BANK_TRANSFER:
        return new BankTransferOrderService();
      default:
        const error = new BusinessLogicError('주문을 처리하는데 문제가 발생했습니다');
        error.setDevMessage('지정된 결제방식이 아닙니다.');
        throw error;
    }
  }
}
