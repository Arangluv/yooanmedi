import { FindOption } from '@/shared';
import { getPayload } from '@/shared/infrastructure';

export const getPaymentHistory = async (option: FindOption) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'payment',
    depth: 0,
    ...option,
  });

  return docs;
};
