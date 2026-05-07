import 'server-only';
import { getTransactionContext } from '@/shared/infrastructure';
import { UpdateOrderDto } from '../model/schemas/order.schema';

// TODO:: update-delete 시 DB와 가장 가까운 부분에서 어떤걸 return할지에 대한 고민
export const updateOrder = async (orderId: number, data: UpdateOrderDto) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.update({
    collection: 'order',
    where: {
      id: {
        equals: orderId,
      },
    },
    data,
    req: {
      transactionID,
    },
  });
};
