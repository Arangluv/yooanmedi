'use server';

import { BaseErrorManager, EndPointResultManager } from '@/shared';
import { CreateCartItemDto } from '@/entities/cart-item';
import { createCartUseCase } from '../infrastructure';
import { SaveCartDetailRequestDto, DeleteCartDetailItemRequestDto } from '../dto';
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
    console.log(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.fetchFail);
  }
};

export const addToCartApi = async (dto: CreateCartItemDto): Promise<AddToCartReponse> => {
  try {
    const { addToCart } = createCartUseCase();
    const cartItem = await addToCart(dto);
    return EndPointResultManager.okWithData({
      data: cartItem,
      message: '장바구니에 상품을 추가했습니다',
    });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.addToCart);
  }
};

export const saveCartChangesApi = async (
  dto: SaveCartDetailRequestDto,
): Promise<SaveCartChangesResponse> => {
  try {
    const { saveCartChanges } = createCartUseCase();
    const cartItems = await saveCartChanges(dto);
    return EndPointResultManager.okWithData({
      data: cartItems,
      message: '장바구니 상품 수량이 변경되었습니다',
    });
  } catch (error) {
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? CART_DETAIL_ERROR_MESSAGE.save);
  }
};

export const deleteFromCartApi = async (
  dto: DeleteCartDetailItemRequestDto,
): Promise<DeleteFromCartResponse> => {
  try {
    const { deleteFromCart } = createCartUseCase();
    const cartItem = await deleteFromCart(dto);
    return EndPointResultManager.okWithData({
      data: cartItem,
      message: '상품을 장바구니에서 삭제했습니다',
    });
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
