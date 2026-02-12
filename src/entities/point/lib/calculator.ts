import type { Inventory } from '@/entities/inventory/@x/point';

/**
 * @description 카드 결제 시 적립되는 적립금
 */
export const getPointWhenUsingCard = (product: Inventory[number]['product']) => {
  return Math.floor(product.price * (product.cashback_rate / 100));
};

/**
 * @description 무통장 입금 시 적립되는 적립금
 */
export const getPointWhenUsingBankTransfer = (product: Inventory[number]['product']) => {
  return Math.floor(product.price * (product.cashback_rate_for_bank / 100));
};

/**
 * @description 상품을 구매 할 시 카드 결제와 무통장 입금 최대 적립금을 반환하는 함수
 */

export const getMaxPointOnPurchase = (product: Inventory[number]['product']) => {
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
    totalPoint += Math.floor(product.price * (product.cashback_rate / 100) * quantity);
  });

  return totalPoint;
};

/**
 * @description 무통장 입금 시 적립되는 적립금
 */
export const getTotalPointWhenUsingBankTransfer = (inventory: Inventory) => {
  let totalPoint = 0;

  inventory.forEach(({ product, quantity }) => {
    totalPoint += Math.floor(product.price * (product.cashback_rate_for_bank / 100) * quantity);
  });

  return totalPoint;
};

/**
 * @description 구매 적립금을 가중치에 따라 계산
 * @description 가중치를 통해 적립된 적립금은 환불 포인트와 관계가 있습니다 -> TODO ::이름 수정이 필요할 수 있습니다
 */
