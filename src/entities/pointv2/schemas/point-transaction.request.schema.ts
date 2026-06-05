import { pointTransactionSchema } from './point-transaction.schema';

export const createPointTransactionSchema = pointTransactionSchema.pick({
  user: true,
  orderProduct: true,
  type: true,
  amount: true,
});
