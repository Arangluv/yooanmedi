import type { Inventory } from '@/entities/inventory/@x/point';
import type { Product } from '@/entities/product/model/schemas/product.schema';

/**
 * @description 카드 결제 시 적립되는 적립금
 */
export const getPointWhenUsingCard = (product: Product) => {
  return Math.floor(product.price * (product.cashback_rate / 100));
};

/**
 * @description 무통장 입금 시 적립되는 적립금
 */
export const getPointWhenUsingBankTransfer = (product: Product) => {
  return Math.floor(product.price * (product.cashback_rate_for_bank / 100));
};

/**
 * @description 상품을 구매 할 시 카드 결제와 무통장 입금 최대 적립금을 반환하는 함수
 */

export const getMaxPointOnPurchase = (product: Product) => {
  const cardPoint = getPointWhenUsingCard(product);
  const bankPoint = getPointWhenUsingBankTransfer(product);

  return Math.max(cardPoint, bankPoint);
};

/**
 * @description 카드 결제 시 적립되는 적립금
 */
export const getTotalPointWhenUsingCardPayments = (inventory: Inventory) => {
  let totalPoint = 0;

  inventory.forEach(({ product, quantity }) => {
    totalPoint += getPointWhenUsingCard(product) * quantity;
  });

  return totalPoint;
};

/**
 * @description 무통장 입금 시 적립되는 적립금
 */
export const getTotalPointWhenUsingBankTransfer = (inventory: Inventory) => {
  let totalPoint = 0;

  inventory.forEach(({ product, quantity }) => {
    totalPoint += getPointWhenUsingBankTransfer(product) * quantity;
  });

  return totalPoint;
};
