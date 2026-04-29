import { CartItem } from '@/entities/cart/@x/price';

export const getOriginalPriceFromInventory = ({ cartItems }: { cartItems: CartItem[] }) => {
  return cartItems.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);
};

export const getDeliveryFeeFromInventory = ({ cartItems }: { cartItems: CartItem[] }) => {
  let originalDeliveryFee = 0;

  cartItems.forEach(({ product, quantity }) => {
    if (product.is_cost_per_unit) {
      originalDeliveryFee += product.delivery_fee * quantity;
    } else {
      originalDeliveryFee += product.delivery_fee;
    }
  });

  return originalDeliveryFee;
};

export const getDiscountedDeliveryFeeFromInventory = ({
  cartItems,
  minOrderPrice,
}: {
  cartItems: CartItem[];
  minOrderPrice: number;
}) => {
  let discountedDeliveryFee = 0;
  const originalPrice = getOriginalPriceFromInventory({ cartItems });

  cartItems.forEach((item) => {
    if (item.product.is_free_delivery && originalPrice >= minOrderPrice) {
      discountedDeliveryFee += getDeliveryFeeFromProduct(item);
    }
  });

  return discountedDeliveryFee;
};

export const getDeliveryFeeFromProduct = (item: CartItem) => {
  const { product, quantity } = item;

  if (product.is_cost_per_unit) {
    return product.delivery_fee * quantity;
  }

  return product.delivery_fee;
};

export const getDeliveryFeeFromProductCosiderFlg = ({
  cartItems,
  freeDeliveryFlg,
}: {
  cartItems: CartItem;
  freeDeliveryFlg: boolean;
}) => {
  const { product } = cartItems;

  if (freeDeliveryFlg && product.is_free_delivery) {
    return 0;
  }

  return getDeliveryFeeFromProduct(cartItems);
};
