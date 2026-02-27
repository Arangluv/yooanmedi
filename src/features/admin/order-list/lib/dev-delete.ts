'use server';

import { getPayload } from '@/shared';

export const deleteAllOrder = async () => {
  const payload = await getPayload();

  const { docs } = await payload.find({
    collection: 'order',
    select: {},
    limit: 2000,
  });

  await Promise.all(
    docs.map(async (doc) => {
      await payload.delete({
        collection: 'order',
        id: doc.id,
      });
    }),
  );

  return {
    success: true,
    message: '주문이 삭제되었습니다',
  };
};
