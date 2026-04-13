import { getTransactionContext } from '@/shared/lib/transaction-context';
import { PaymentHistoryEntity } from '../model/schemas/create-payment-history.schema';

export const createPaymentHistory = async (entity: PaymentHistoryEntity) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.create({
    collection: 'payment',
    data: entity,
    req: {
      transactionID,
    },
  });
};
