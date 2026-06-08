import { PriceItemDto } from './price.dto';

export const calcItemPrice = (item: PriceItemDto) => {
  const {
    product: { price },
    quantity,
  } = item;

  return price * quantity;
};

export const calcDeliveryFee = (item: PriceItemDto, isFreeDelivery: boolean) => {
  if (isFreeDelivery && item.product.is_free_delivery) {
    return 0;
  }

  return item.product.delivery_fee * (item.product.is_cost_per_unit ? item.quantity : 1);
};
