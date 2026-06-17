import { BaseError } from '@/shared';

export const PRODUCT_LIST_ERROR_MESSAGE = {
  fetchFail: '상품 리스트를 가져오는데 문제가 발생했습니다',
};

export class ProductListError extends BaseError {
  static fetchFail(message: string) {
    return new ProductListError({
      clientMsg: message,
      errorName: 'ProductListError',
    });
  }
}
