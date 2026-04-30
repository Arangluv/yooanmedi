import { CartItem } from '@/entities/cart/@x/price';

export const getOriginalPriceFromCartItems = ({ cartItems }: { cartItems: CartItem[] }) => {
  return cartItems.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);
};

export const getDeliveryFeeFromCartItems = ({ cartItems }: { cartItems: CartItem[] }) => {
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

export const getDiscountedDeliveryFeeFromCartItems = ({
  cartItems,
  minOrderPrice,
}: {
  cartItems: CartItem[];
  minOrderPrice: number;
}) => {
  let discountedDeliveryFee = 0;
  const originalPrice = getOriginalPriceFromCartItems({ cartItems });

  cartItems.forEach((item) => {
    if (item.product.is_free_delivery && originalPrice >= minOrderPrice) {
      discountedDeliveryFee += getDeliveryFeeFromCartItem(item);
    }
  });

  return discountedDeliveryFee;
};

export const getDeliveryFeeFromCartItem = (cartItem: CartItem) => {
  const { product, quantity } = cartItem;

  if (product.is_cost_per_unit) {
    return product.delivery_fee * quantity;
  }

  return product.delivery_fee;
};

export const getDeliveryFeeFromCartItemCosiderFlg = ({
  cartItem,
  freeDeliveryFlg,
}: {
  cartItem: CartItem;
  freeDeliveryFlg: boolean;
}) => {
  const { product } = cartItem;

  if (freeDeliveryFlg && product.is_free_delivery) {
    return 0;
  }

  return getDeliveryFeeFromCartItem(cartItem);
};
