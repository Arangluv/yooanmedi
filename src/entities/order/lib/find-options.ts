import { type FindOption } from '@/shared';
import { Where } from 'payload';
import { OrderStatus } from '../constants/order-status';

export const OrderFindOption = {
  adminOrderList: {
    build({ page, orderStatus }: { page: number; orderStatus: OrderStatus | 'all' }): FindOption {
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
