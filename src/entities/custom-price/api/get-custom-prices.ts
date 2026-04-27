import 'server-only';
import { FindOption } from '@/shared';
import { getPayload } from '@/shared/infrastructure';

export const getCustomPrices = async (option: FindOption) => {
  const payload = await getPayload();

  const { docs } = await payload.find({
    collection: 'product-price',
    select: {
      price: true,
      product: true,
    },
    populate: {
      product: {},
    },
    ...option,
  });

  return docs;
};
