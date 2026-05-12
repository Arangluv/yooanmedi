import { zodSafeParse } from '@/shared';
import { ClientOrder } from '@/features/order/order-list';
import { Order, orderSchema } from '@/entities/order';

export const toOrder = (data: ClientOrder): Order => {
  return zodSafeParse(orderSchema, {
    ...data,
    user: data.user.id,
    orderProducts: data.orderProducts.map((item) => item.id),
  });
};
