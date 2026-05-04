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

export const createCartItem = async (
  dto: CreateCartItemRequestDto,
): Promise<EndPointResult<CartItem>> => {
  try {
    const cartService = new CartService();
    const createdItem = await cartService.createCartItem(dto);

    return okWithData({
      message: `상품을 장바구니에 ${dto.quantity}개 담았습니다`,
      data: createdItem,
    });
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};

export const deleteCartItem = async (cartItem: CartItem): Promise<EndPointResult<CartItem>> => {
  try {
    const cartService = new CartService();
    const deletedItem = await cartService.deleteCartItem(cartItem);

    return okWithData({
      message: `상품을 장바구니에서 삭제했습니다`,
      data: deletedItem,
    });
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

    return ok('수량이 변경되었습니다.');
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};

export const clearCart = async () => {
  try {
    const cartService = new CartService();
    await cartService.clearCart();

    return ok();
  } catch (error) {
    const { message } = normalizeError(error);
    Logger.error(error);

    return failure(message);
  }
};
