import type { Inventory } from '@/entities/inventory/@x/price';

export const getOriginalPriceFromInventory = ({ inventory }: { inventory: Inventory }) => {
  return inventory.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);
};

export const getDeliveryFeeFromInventory = ({ inventory }: { inventory: Inventory }) => {
  let originalDeliveryFee = 0;

  inventory.forEach(({ product, quantity }) => {
    if (product.is_cost_per_unit) {
      originalDeliveryFee += product.delivery_fee * quantity;
    } else {
      originalDeliveryFee += product.delivery_fee;
    }
  });

  return originalDeliveryFee;
};

export const getDiscountedDeliveryFeeFromInventory = ({
  inventory,
  minOrderPrice,
}: {
  inventory: Inventory;
  minOrderPrice: number;
}) => {
  let discountedDeliveryFee = 0;
  const originalPrice = getOriginalPriceFromInventory({ inventory });

  inventory.forEach(({ product, quantity }) => {
    if (product.is_free_delivery && originalPrice >= minOrderPrice) {
      discountedDeliveryFee += getDeliveryFeeFromProduct({ product, quantity });
    }
  });

  return discountedDeliveryFee;
};

export const getDeliveryFeeFromProduct = (item: Inventory[number]) => {
  const { product, quantity } = item;

  if (product.is_cost_per_unit) {
    return product.delivery_fee * quantity;
  }

  return product.delivery_fee;
};

export const getDeliveryFeeFromProductCosiderFlg = ({
  inventoryItem,
  freeDeliveryFlg,
}: {
  inventoryItem: Inventory[number];
  freeDeliveryFlg: boolean;
}) => {
  const { product } = inventoryItem;

  if (freeDeliveryFlg && product.is_free_delivery) {
    return 0;
  }

  return getDeliveryFeeFromProduct(inventoryItem);
};
