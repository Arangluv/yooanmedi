import { BasePayload } from 'payload';

export const seedCarts = async (payload: BasePayload) => {
  try {
    const { docs: users } = await payload.find({
      collection: 'users',
      limit: 0,
      where: {
        role: {
          equals: 'client',
        },
      },
    });

    for (const user of users) {
      const { docs: alreadyExistingCart } = await payload.find({
        collection: 'carts',
        where: {
          user: { equals: user.id },
        },
        limit: 1,
      });

      if (alreadyExistingCart.length > 0) {
        continue;
      }

      await payload.create({
        collection: 'carts',
        data: {
          user: user.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
