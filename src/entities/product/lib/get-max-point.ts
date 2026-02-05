import type { ProductItem } from '../model/types';

// TODO: Point라는 도메인 분리가 필요할 수 있습니다.

/**
 *
 * 상품을 구매 할 시 최대 적립금을 반환합니다.
 * 카드 결제와 무통장 입금 적립 비율을 고려하여 최대 적립금을 반환합니다.
 */
export const getMaxPointOnPurchase = (product: ProductItem) => {
  const cardPoint = Math.floor(product.price * (product.cashback_rate / 100));
  const bankPoint = Math.floor(product.price * (product.cashback_rate_for_bank / 100));

  return Math.max(cardPoint, bankPoint);
};

export const getPointWhenUsingCard = (product: ProductItem) => {
  return Math.floor(product.price * (product.cashback_rate / 100));
};

export const getPointWhenUsingBankTransfer = (product: ProductItem) => {
  return Math.floor(product.price * (product.cashback_rate_for_bank / 100));
};
