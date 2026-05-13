import { FindOption, zodSafeParse } from '@/shared';
import { getPaymentHistory } from './payment';
import { paymentSchema } from '../model/payment.schema';

export class PaymentHistoryRepository {
  public static async findOne(option: FindOption) {
    const UNIQUE_INDEX = 0;
    const result = await getPaymentHistory(option);
    return zodSafeParse(paymentSchema, result[UNIQUE_INDEX]);
  }
}
