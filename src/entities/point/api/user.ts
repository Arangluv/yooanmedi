import { getPayload } from '@/shared/lib/get-payload';

export const getUser = async (id: number) => {
  const payload = await getPayload();

  return payload.findByID({
    collection: 'users',
    id: id,
    select: {
      point: true,
    },
  });
};
