import type { Inventory } from '@/entities/inventory/@x/point';

export const getPointWhenUsingCardPayments = (inventory: Inventory) => {
  let totalPoint = 0;

  inventory.forEach(({ product, quantity }) => {
    totalPoint += Math.floor(product.price * (product.cashback_rate / 100) * quantity);
  });

  return totalPoint;
};

export const getPointWhenUsingBankTransfer = (inventory: Inventory) => {
  let totalPoint = 0;

  inventory.forEach(({ product, quantity }) => {
    totalPoint += Math.floor(product.price * (product.cashback_rate_for_bank / 100) * quantity);
  });

  return totalPoint;
};
