/** TODO :: refactoring -> order-product.service.ts로 로직 이동 */
import { PAYMENTS_METHOD, PaymentsMethod } from '@/entities/order/constants/payments-method';
import { PGOrderProductPaymentService } from './pg.service';
import { BankTransferOrderProductPaymentService } from './bank-transfer.service';
import { BusinessLogicError } from '@/shared/model/errors/domain.error';

export class OrderProductPaymentService {
  public static for(paymentsMethod: PaymentsMethod) {
    switch (paymentsMethod) {
      case PAYMENTS_METHOD.credit_card:
        return new PGOrderProductPaymentService();
      case PAYMENTS_METHOD.bank_transfer:
        return new BankTransferOrderProductPaymentService();
      default:
        const error = new BusinessLogicError('주문 상품을 처리하는데 문제가 발생했습니다');
        error.setDevMessage('지정된 결제방식이 아닙니다.');
        throw error;
    }
  }
}
