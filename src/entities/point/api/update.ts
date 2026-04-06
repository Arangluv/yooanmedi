import { getPayload } from '@/shared/lib/get-payload';

interface UpdateUserPointParams {
  targetUser: number;
  willUpdatePoint: number;
}

export const updateUserPoint = async ({ targetUser, willUpdatePoint }: UpdateUserPointParams) => {
  const payload = await getPayload();

  await payload.update({
    collection: 'users',
    id: targetUser,
    data: { point: willUpdatePoint },
  });
};
