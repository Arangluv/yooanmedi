import { FindOption } from '@/shared';
import { Cart } from '@/entities/cartv2';

export const CartDetailFindOption = {
  cartItems: (cart: Cart): FindOption => {
    return {
      pagination: false,
      where: {
        id: {
          in: cart.cartItems,
        },
      },
    };
  },

  customPrice: (cart: Cart): FindOption => {
    return {
      pagination: false,
      where: {
        user: {
          equals: cart.user,
        },
      },
    };
  },

  allCartItem: (cartId: number): FindOption => {
    return {
      pagination: false,
      where: {
        cart: {
          equals: cartId,
        },
      },
    };
  },
};
