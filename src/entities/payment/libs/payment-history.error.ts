import { BaseError } from '@/shared';
import { PAYMENT_HISTORY_ERROR_MESSAGE } from '../constant';

export class PaymentHistoryError extends BaseError {
  static invalidFindOption() {
    return new BaseError({
      clientMsg: PAYMENT_HISTORY_ERROR_MESSAGE.invalidData,
      devMsg: '잘못된 FindOption type입니다.',
      errorName: 'PaymentHistoryInvalidFindOptionError',
    });
  }
}
