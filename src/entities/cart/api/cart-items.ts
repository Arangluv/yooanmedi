import 'server-only';
import { getPayload } from '@/shared/infrastructure';
import type { CartItem, CreateCartItemEntity } from '../model/cart.schema';

export const getCartItems = async (cartId: number) => {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: 'cart-items',
    where: {
      carts: {
        equals: cartId,
      },
    },
  });

  return docs;
};

export const getCartItem = async (cartItemId: number) => {
  const payload = await getPayload();
  const result = await payload.findByID({
    collection: 'cart-items',
    id: cartItemId,
  });

  return result;
};

export const createCartItem = async (entity: CreateCartItemEntity): Promise<void> => {
  const payload = await getPayload();
  await payload.create({
    collection: 'cart-items',
    data: entity,
  });
};

export const updateCartItem = async (data: CartItem) => {
  const payload = await getPayload();
  const { docs: successUpdatedDocs } = await payload.update({
    collection: 'cart-items',
    select: {},
    where: {
      id: {
        equals: data.id,
      },
    },
    data,
  });

  return successUpdatedDocs;
};

export const deleteCartItem = async (cartItemId: number) => {
  const payload = await getPayload();
  const { docs } = await payload.delete({
    collection: 'cart-items',
    select: {},
    where: {
      id: {
        equals: cartItemId,
      },
    },
  });

  return docs;
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
