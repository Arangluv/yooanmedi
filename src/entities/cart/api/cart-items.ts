import 'server-only';
import { getPayload } from '@/shared/infrastructure';
import type { CartItem, CreateCartItemEntity } from '../model/cart.schema';

export const createCartItem = async (entity: CreateCartItemEntity): Promise<void> => {
  const payload = await getPayload();
  await payload.create({
    collection: 'cart-items',
    data: entity,
  });
};

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

export const deleteCartItem = async (cartItemId: number) => {
  const payload = await getPayload();
  const result = await payload.delete({
    collection: 'cart-items',
    select: {},
    where: {
      id: {
        equals: cartItemId,
      },
    },
  });

  return result;
};

export const deleteAllCartItem = async (cartItemIds: number[]) => {
  const payload = await getPayload();
  const result = await payload.delete({
    collection: 'cart-items',
    select: {},
    where: {
      id: {
        in: cartItemIds,
      },
    },
  });

  return result;
};
