import 'server-only';
import { getPayload } from '@shared/infrastructure';

export const getProductCategories = async () => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'product-category',
    sort: 'createdAt',
  });

  return docs;
};
