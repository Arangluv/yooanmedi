import { PaymentHistoryEntity } from '../model/schemas/create-payment-history.schema';
import { createPaymentHistory } from './create';

export class PaymentHistoryRepository {
  public static async create(entity: PaymentHistoryEntity) {
    await createPaymentHistory(entity);
  }
}
