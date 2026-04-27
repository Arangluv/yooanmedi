import { getPayload } from '@/shared/infrastructure';

export const getUserById = async (id: number) => {
  const payload = await getPayload();
  return await payload.findByID({
    collection: 'users',
    id,
  });
};
