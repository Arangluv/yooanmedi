import { type FindOption } from '@/shared';
import { OrderStatus } from '../constants/order-status';
import { Where } from 'payload';

export const OrderFindOption = {
  adminOrderList: {
    build(page: number, orderStatus: OrderStatus | 'all'): FindOption {
      const where: Where = {};
      if (orderStatus !== 'all') {
        where.orderStatus = {
          equals: orderStatus,
        };
      }

      return {
        pagination: true,
        page: page,
        limit: 25,
        where,
      };
    },
  },
};
