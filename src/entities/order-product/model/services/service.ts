import { PAYMENTS_METHOD, PaymentsMethod } from '@/entities/order/constants/payments-options';
import { PGOrderProductService } from './pg.service';
import { BankTransferOrderProductService } from './bank-transfer.service';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';

export class OrderProductService {
  public static for(paymentsMethod: PaymentsMethod) {
    switch (paymentsMethod) {
      case PAYMENTS_METHOD.CREDIT_CARD:
        return new PGOrderProductService();
      case PAYMENTS_METHOD.BANK_TRANSFER:
        return new BankTransferOrderProductService();
      default:
        const error = new BusinessLogicError('주문 상품을 처리하는데 문제가 발생했습니다');
        error.setDevMessage('지정된 결제방식이 아닙니다.');
        throw error;
    }
  }
}
