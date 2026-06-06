'use server';

import { BaseErrorManager, EndPointResultManager } from '@/shared';
import { createCartUseCase } from '../infrastructure';
import { CreateCartItemDto } from '@/entities/cart-item';
import { SaveCartChangeRequestDto, DeleteCartItemToCartRequestDto } from '../dto';
import {
  GetCartDetailResponse,
  AddToCartReponse,
  SaveCartChangesResponse,
  DeleteFromCartResponse,
  ClearCartResponse,
} from '../types';
import { CART_DETAIL_ERROR_MESSAGE } from '../constants';

export const getCartApi = async (): Promise<GetCartDetailResponse> => {
  try {
    const { getCart } = createCartUseCase();
    const cartDetail = await getCart();
    return EndPointResultManager.okWithData({ data: cartDetail });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.fetchFail);
  }
};

export const addToCartApi = async (dto: CreateCartItemDto): Promise<AddToCartReponse> => {
  try {
    const { addToCart } = createCartUseCase();
    const cartItem = await addToCart(dto);
    return EndPointResultManager.okWithData({ data: cartItem });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.addToCart);
  }
};

export const saveCartChangesApi = async (dto: SaveCartChangeRequestDto): Promise<SaveCartChangesResponse> => {
  try {
    const { saveCartChanges } = createCartUseCase();
    const cartItems = await saveCartChanges(dto);
    return EndPointResultManager.okWithData({ data: cartItems });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.save);
  }
};

export const deleteFromCartApi = async (dto: DeleteCartItemToCartRequestDto): Promise<DeleteFromCartResponse> => {
  try {
    const { deleteFromCart } = createCartUseCase();
    const cartItem = await deleteFromCart(dto);
    return EndPointResultManager.okWithData({ data: cartItem });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.deleteToCart);
  }
};

export const clearCartApi = async (cartId: number): Promise<ClearCartResponse> => {
  try {
    const { clearCart } = createCartUseCase();
    const cartItems = await clearCart(cartId);
    return EndPointResultManager.okWithData({ data: cartItems });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.deleteToCart);
  }
};
