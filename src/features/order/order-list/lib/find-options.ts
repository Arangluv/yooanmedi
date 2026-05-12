import moment from 'moment';
import { type Where } from 'payload';
import { type User } from '@/entities/user';
import { type FindOption } from '@/shared';
import { ClientOrderListSearchParams } from './generate-search-param';

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

      if (searchParams['order_status']) {
        where.orderStatus = {
          equals: searchParams['order_status'],
        };
      }

      return {
        pagination: false,
        where,
        depth: 4,
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
};
