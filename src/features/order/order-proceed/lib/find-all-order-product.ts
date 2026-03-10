import { getPayload } from '@/shared/lib/get-payload';

export const findAllOrderProduct = async (orderId: number) => {
  const payload = await getPayload();
  const orderProducts = await payload.find({
    collection: 'order-product',
    select: {
      orderProductStatus: true,
    },
    where: {
      order: { equals: orderId },
    },
  });

  return orderProducts.docs;
};
