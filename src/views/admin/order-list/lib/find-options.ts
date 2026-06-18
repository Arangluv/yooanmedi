import { Where } from 'payload';
import { FindOption } from '@/shared';
import { OrderStatus } from '@/entities/order';

export const OrderListFindOption = {
  build({ page, orderStatus }: { page: number; orderStatus: OrderStatus | 'all' }): FindOption {
    const where: Where = {};
    if (orderStatus !== 'all') {
      where.orderStatus = {
        equals: orderStatus,
      };
    }

    return {
      pagination: true,
      limit: 50,
      page,
      depth: 1,
      where,
      populate: {
        'order-product': {
          orderProductStatus: true,
        },
      },
    };
  },
};
