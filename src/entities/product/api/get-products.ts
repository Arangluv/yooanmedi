import 'server-only';
import { getPayload } from '@/shared';

export const getProducts = async (ids: number[]) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'product',
    where: {
      id: { in: ids },
    },
  });

  return docs;
};
