import { getPayload } from '@/shared/lib/get-payload';

export const getHistories = async (history: number[]) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'point-transaction',
    where: {
      id: { in: history },
    },
  });

  return docs;
};
