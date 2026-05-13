import { type FindOption } from '@/shared';
import { getPayload } from '@/shared/infrastructure';

export const getOrderList = async (option: FindOption) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'order',
    ...option,
  });

  return docs;
};
