import 'server-only';
import { type FindOption } from '@/shared';
import { getPayload, getTransactionContext } from '@/shared/infrastructure';
import { type UpdateOrderProductDto } from '../model/schemas/order-product.schema';

export const getOrderProducts = async (options: FindOption) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'order-product',
    ...options,
  });

  return docs;
};

export const updateOrderProducts = async (orderProductId: number[], dto: UpdateOrderProductDto) => {
  const { payload, transactionID } = getTransactionContext();
  await payload.update({
    collection: 'order-product',
    where: {
      id: {
        in: orderProductId,
      },
    },
    data: dto,
    req: {
      transactionID,
    },
  });
};
