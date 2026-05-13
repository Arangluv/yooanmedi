import { FindOption } from '@/shared';
import { getPayload } from '@/shared/infrastructure';

export const getAdminOrderList = async (option: FindOption) => {
  const payload = await getPayload();
  const { docs, totalDocs } = await payload.find({
    collection: 'order',
    ...option,
  });

  return { docs, totalDocs };
};
