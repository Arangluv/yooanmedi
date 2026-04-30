import { FindOption } from '@/shared';
import { User } from '@/entities/user/@x/carts';

export const buildCustomPriceFindOption = (user: User): FindOption => {
  return {
    pagination: false,
    where: {
      user: {
        equals: user.id,
      },
    },
  };
};
