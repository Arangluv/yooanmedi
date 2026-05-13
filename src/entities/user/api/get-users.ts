'use server';
import { getPayload } from '@/shared/infrastructure';

export const getUsers = async (userIds: number[]) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'users',
    pagination: false,
    depth: 0,
    where: {
      id: {
        in: userIds,
      },
    },
  });

  return docs;
};
