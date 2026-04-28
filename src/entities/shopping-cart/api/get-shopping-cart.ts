import 'server-only';
import { getPayload } from '@/shared/infrastructure';

export const getAllShoppingCart = async (userId: number) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'shopping-cart',
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
