import { type User } from '@/entities/user';
import { type Order } from './schemas/order.schema';
import { OrderProductWithProduct } from '@/entities/order-product';

export type OrderWithUser = Omit<Order, 'user'> & {
  user: User;
};

function withUserDetail<T extends Order>(order: T, userMap: Map<number, User>): T;

function withUserDetail<T extends Order>(order: T, user: User): T;

function withUserDetail<T extends Order>(order: T, userOrMap: User | Map<number, User>): T {
  const user = userOrMap instanceof Map ? userOrMap.get(order.user) : userOrMap;

  return {
    ...order,
    user,
  };
}

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

function withUserList<T extends Order>(orders: T[], userMap: Map<number, User>): T[];

function withUserList<T extends Order>(orders: T[], user: User): T[];

function withUserList<T extends Order>(orders: T[], userOrMap: User | Map<number, User>): T[] {
  return orders.map((order) => detail.withUser(order, userOrMap as any));
}

export const list = {
  withUser: withUserList,
};
