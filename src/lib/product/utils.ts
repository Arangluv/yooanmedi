import { formatNumberWithCommas } from "@order/utils";
import { ProductItemType } from "@order/_type";

export const calculateTotalDeliveryFee = ({ inventory }: { inventory: Array<{ product: ProductItemType; quantity: number }> }) => {
  let totalDeliveryFee = 0;
  inventory.forEach((item) => {
    const { delivery_fee, is_cost_per_unit } = item.product;
    const quantity = item.quantity;

    if (is_cost_per_unit) {
      totalDeliveryFee += delivery_fee * quantity;
    } else {
      totalDeliveryFee += delivery_fee;
    }
  });

  return totalDeliveryFee;
}

export const calculateDeliveryFee = ({ product }: { product: { delivery_fee: number, is_cost_per_unit: boolean, quantity: number } }) => {
  const { delivery_fee, is_cost_per_unit, quantity } = product;

  if (is_cost_per_unit) {
    return formatNumberWithCommas(delivery_fee * quantity);
  }

  return formatNumberWithCommas(delivery_fee);
}

