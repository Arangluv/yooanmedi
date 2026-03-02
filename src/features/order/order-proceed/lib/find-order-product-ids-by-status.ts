import { getPayload } from '@/shared/lib/get-payload';
import { OrderStatus } from '@/entities/order/constants/order-status';

export const findOrderProductIdsByStatus = async (orderId: number, orderStatus: OrderStatus) => {
  const payload = await getPayload();
  const orderProducts = await payload.find({
    collection: 'order-product',
    select: {},
    where: {
      order: { equals: orderId },
      orderProductStatus: {
        equals: orderStatus,
      },
    },
  });

  return orderProducts.docs.map((orderProduct) => orderProduct.id);
};
