import 'server-only';
import { getPayload } from '@/shared/infrastructure';
import { FindOption } from '@/shared';

export const getOrderProducts = async (options: FindOption) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'order-product',
    ...options,
  });

  return docs;
};
