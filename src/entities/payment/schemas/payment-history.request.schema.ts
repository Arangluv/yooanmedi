import { paymentHistorySchema } from './payment-history.schema';

export const createPaymentHistorySchema = paymentHistorySchema.pick({
  order: true,
  amount: true,
  pgCno: true,
  paymentsMethod: true,
});

export const getPaymentHistorySchema = paymentHistorySchema.pick({
  order: true,
});
