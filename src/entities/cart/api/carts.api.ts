'use server';

import { EndPointResult, okWithData, failure, normalizeError, ok } from '@/shared';
import { Logger } from '@/shared/infrastructure';
import { CartService } from '../infrastructure';
import type { Cart, CartItem, CreateCartItemRequestDto } from '../model/cart.schema';

export const getCart = async (): Promise<EndPointResult<Cart>> => {
  try {
    const cartService = new CartService();
    const cart = await cartService.getCart();

    return okWithData({
      data: cart,
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};

export const createCartItem = async (dto: CreateCartItemRequestDto) => {
  try {
    const cartService = new CartService();
    await cartService.createCartItem(dto);

    return ok();
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};

export const deleteCartItem = async (cartItemId: number) => {
  try {
    const cartService = new CartService();
    await cartService.deleteCartItem(cartItemId);

    return ok();
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};

export const updateCart = async (dto: CartItem[]) => {
  try {
    const cartService = new CartService();
    await cartService.updateCart(dto);

    return ok();
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};
