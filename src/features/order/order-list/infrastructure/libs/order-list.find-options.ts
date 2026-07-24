import { Where } from 'payload';
import dayjs from 'dayjs';
import { FindOption } from '@/shared';
import { User } from '@/entities/user';
import {
  AdminOrderListServerSearchParams,
  ClientOrderListServerSearchParams,
} from './order-list.search-params';

export const OrderListFindOption = {
  admin: (searchParams: AdminOrderListServerSearchParams): FindOption => {
    const where: Where = {};
    if (searchParams.orderStatus) {
      where.orderStatus = {
        equals: searchParams.orderStatus,
      };
    }
    return {
      pagination: true,
      limit: 50,
      page: searchParams.page,
      depth: 1,
      where,
    };
  },

  client: ({
    user,
    searchParams,
  }: {
    user: User;
    searchParams: ClientOrderListServerSearchParams;
  }): FindOption => {
    const where: Where = {
      createdAt: {
        greater_than_equal: dayjs(searchParams.from).hour(0).minute(0).second(0).toDate(),
        less_than_equal: dayjs(searchParams.to).hour(23).minute(59).second(59).toDate(),
      },
      user: {
        equals: user.id,
      },
    };

    if (searchParams.orderStatus) {
      where.orderStatus = {
        equals: searchParams.orderStatus,
      };
    }

    return {
      pagination: false,
      where,
      depth: 3,
    };
  },
};
