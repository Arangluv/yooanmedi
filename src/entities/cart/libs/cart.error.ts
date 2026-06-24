import { BaseError } from '@/shared';
import { CART_ERROR_MESSAGE } from '../constants';

export class CartError extends BaseError {
  static invalidUserId(userId: unknown) {
    return new CartError({
      clientMsg: CART_ERROR_MESSAGE.fetchFail,
      devMsg: `잘못된 userId 입니다  \n ${userId}`,
      errorName: 'InvalidCartFindOptionError',
    });
  }
}
