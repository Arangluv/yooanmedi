import 'server-only';
import { getPayload } from '@/shared/infrastructure';

export const getAllCart = async (userId: number) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'carts',
    where: {
      users: {
        equals: {
          userId,
        },
      },
    },
  });

  return docs;
};
