import moment from 'moment';
import { Where } from 'payload';
import { User } from '@/entities/user';
import { FindOption } from '@/shared';
import { ClientOrderListSearchParams, AdminOrderListSearchParams } from './search';

export const OrderListFindOption = {
  clientOrderList: {
    build({
      user,
      searchParams,
    }: {
      user: User;
      searchParams: ClientOrderListSearchParams;
    }): FindOption {
      const where: Where = {
        createdAt: {
          greater_than_equal: moment(searchParams.from).hour(0).minute(0).second(0).toDate(),
          less_than_equal: moment(searchParams.to).hour(23).minute(59).second(59).toDate(),
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
        populate: {
          'order-product': {
            productNameSnapshot: true,
            priceSnapshot: true,
            quantity: true,
            productDeliveryFee: true,
            orderProductStatus: true,
            product: true,
          },
          product: {
            manufacturer: true,
            insurance_code: true,
            image: true,
          },
        },
      };
    },
  },
  adminOrderList: {
    build(searchParams: AdminOrderListSearchParams): FindOption {
      const where: Where = {};
      if (searchParams.orderStatus) {
        where.orderStatus = {
          equals: searchParams.orderStatus,
        };
      }
      return {
        pagination: true,
        limit: 25,
        page: searchParams.page,
        depth: 1,
        where,
        populate: {
          'order-product': {
            orderProductStatus: true,
          },
        },
      };
    },
  },
};
