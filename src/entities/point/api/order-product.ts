import { getPayload } from '@/shared/lib/get-payload';

export const getOrderProduct = async (id: number) => {
  const payload = await getPayload();

  return payload.findByID({
    collection: 'order-product',
    id: id,
    select: {},
  });
};
