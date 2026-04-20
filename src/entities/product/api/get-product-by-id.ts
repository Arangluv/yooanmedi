import 'server-only';
import { getPayload } from '@/shared';

export const getProductById = async (id: number) => {
  const payload = await getPayload();

  const product = await payload.findByID({
    collection: 'product',
    id,
  });

  return product;
};
