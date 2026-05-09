import { type User } from '@/entities/user';
import { type Order } from './schemas/order.schema';
import { OrderProductWithProduct } from '@/entities/order-product';

export type OrderWithUser = Omit<Order, 'user'> & {
  user: User;
};

export const detail = {
  withUser: <T extends Order>(order: T, userMap: Map<number, User>): T => {
    return { ...order, user: userMap.get(order.user) };
  },

  withOrderProduct: <T extends Order>(
    order: T,
    orderProductMap: Map<number, OrderProductWithProduct>,
  ) => {
    const orderProducts = order.orderProducts.map((id) => {
      return orderProductMap.get(id);
    });

    return {
      ...order,
      orderProducts,
    };
  },
};

export const list = {
  withUser: <T extends Order>(orders: T[], userMap: Map<number, User>): T[] => {
    return orders.map((order) => detail.withUser(order, userMap));
  },
};
