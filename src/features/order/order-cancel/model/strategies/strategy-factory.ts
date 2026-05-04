import { PAYMENTS_METHOD, PaymentsMethod } from '@/entities/order/constants/payments-method';

import { CancelStrategy } from './cancel-strategy';
import { CancelCardPaymentStrategy } from './cancel-card-strategy';
import { CancelBankTransferStrategy } from './cancel-banktransfer-strategy';

export class PaymentCancelStrategyFactory {
  private static strategies = new Map<PaymentsMethod, CancelStrategy>([
    [PAYMENTS_METHOD.credit_card, new CancelCardPaymentStrategy()],
    [PAYMENTS_METHOD.bank_transfer, new CancelBankTransferStrategy()],
  ]);

  static getStrategy(paymentsMethod: PaymentsMethod): CancelStrategy {
    const strategy = this.strategies.get(paymentsMethod);

    if (!strategy) {
      throw new Error('지원하지 않는 결제 방법입니다');
    }

    return strategy;
  }
}
