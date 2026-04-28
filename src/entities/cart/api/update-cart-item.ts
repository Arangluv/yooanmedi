import 'server-only';
import { getPayload } from '@/shared/infrastructure';
import { CartItem } from '../model/cart.schema';

export const updateCartItem = async (data: CartItem) => {
  const payload = await getPayload();
  const result = await payload.update({
    collection: 'cart-items',
    select: {},
    where: {
      id: {
        equals: data.id,
      },
    },
    data,
  });

  return result;
};
