import 'server-only';
import { getPayload } from '@/shared/infrastructure';

export const getCart = async (userId: number) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'carts',
    where: {
      user: {
        equals: userId,
      },
    },
    populate: {
      users: {},
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
