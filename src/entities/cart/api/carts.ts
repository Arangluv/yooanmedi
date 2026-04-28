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

export const createCart = async (userId: number) => {
  const payload = await getPayload();
  await payload.create({
    collection: 'carts',
    data: {
      user: userId,
    },
  });
};
