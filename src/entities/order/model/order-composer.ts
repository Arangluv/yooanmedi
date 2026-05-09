import { type User } from '@/entities/user';
import { type Order } from './schemas/order.schema';

export type OrderWithUser = Omit<Order, 'user'> & {
  user: User;
};

export const list = {
  withUser: <T extends Order>(orders: T[], userMap: Map<number, User>): OrderWithUser[] => {
    return orders.map((order) => ({
      ...order,
      user: userMap.get(order.user) as User,
    }));
  },
};
