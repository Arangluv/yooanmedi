import 'server-only';
import { FindOption } from '@/shared';
import { getPayload } from '@shared/infrastructure';

export const getProducts = async (options: FindOption): Promise<any> => {
  const payload = await getPayload();
  const { docs, totalDocs } = await payload.find({
    collection: 'product',
    ...options,
  });

  return { products: docs, totalCount: totalDocs };
};
