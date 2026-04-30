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

    return ok(`상품을 장바구니에 ${dto.quantity}개 담았습니다`);
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

    return ok('장바구니에서 상품을 삭제했습니다');
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
