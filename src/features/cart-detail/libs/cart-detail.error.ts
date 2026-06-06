import { BaseError } from '@/shared';
import { CART_DETAIL_ERROR_MESSAGE } from '../constants';

export class CartDetailError extends BaseError {
  static customPriceNotFound() {
    return new CartDetailError({
      clientMsg: CART_DETAIL_ERROR_MESSAGE.fetchFail,
      devMsg: '개별 설정가격이 비어있습니다',
      errorName: 'CartDetailDataAssembleError',
    });
  }

  static fetchError(message: string) {
    return new CartDetailError({
      clientMsg: message,
      errorName: 'CartDetailFetchError',
    });
  }

  static addToCart() {
    return new CartDetailError({
      clientMsg: CART_DETAIL_ERROR_MESSAGE.addToCart,
      errorName: 'CartDetailCreateError',
    });
  }

  static deleteToCart() {
    return new CartDetailError({
      clientMsg: CART_DETAIL_ERROR_MESSAGE.addToCart,
      errorName: 'CartDetailCreateError',
    });
  }
}
