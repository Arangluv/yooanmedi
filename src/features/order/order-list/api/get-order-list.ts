'use server';

import { Where } from 'payload';
import type { Image } from '@/payload-types';

import type { User } from '@/entities/user';
import { OrderProduct } from '@/entities/order-product';
import { Order } from '@/entities/order';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { getPayload } from '@/shared';

import type { OrderListSearchParamsType } from '../model/sever-search-params';
import { orderListSchema } from '../model/order-list-schema';
import { normalizeOrder, OrderListItem } from '../lib/normalization';

type GetOrdersDto = {
  user: User | null;
  searchParams: OrderListSearchParamsType;
};

type OrderProductType = {
  id: number;
  image: Image;
  manufacturer: string;
};

export type OrderListItemBeforeNormalize = Pick<
  Order,
  'id' | 'orderStatus' | 'orderNo' | 'finalPrice' | 'createdAt'
> & {
  paymentsMethod: (typeof PAYMENTS_METHOD)[keyof typeof PAYMENTS_METHOD];
  orderProducts: {
    docs: (Pick<
      OrderProduct,
      | 'id'
      | 'orderProductStatus'
      | 'productNameSnapshot'
      | 'priceSnapshot'
      | 'productDeliveryFee'
      | 'quantity'
    > & {
      product: OrderProductType;
    })[];
    hasNextPage?: boolean;
  };
};

type OrderListSuccessResponse = {
  success: true;
  data: OrderListItem[];
};

type OrderListFailureResponse = {
  success: false;
  data: null;
  message: string;
};

export const getOrderList = async (
  dto: GetOrdersDto,
): Promise<OrderListSuccessResponse | OrderListFailureResponse> => {
  // TODO :: 보일러플레이트 코드 -> 제거하기
  if (!dto.user) {
    throw new Error('유저 정보가 없습니다');
  }

  try {
    const payload = await getPayload();

    const searchCondition = orderListSchema.parse(dto.searchParams);
    const where: Where = {
      createdAt: {
        greater_than_equal: searchCondition.from,
        less_than_equal: searchCondition.to,
      },
      user: {
        equals: dto.user.id,
      },
    };

    if (searchCondition.orderStatus) {
      where.orderStatus = {
        equals: searchCondition.orderStatus,
      };
    }

    const { docs: orderList } = await payload.find({
      collection: 'order',
      select: {
        finalPrice: true,
        orderNo: true,
        orderStatus: true,
        paymentsMethod: true,
        orderProducts: true,
        createdAt: true,
      },
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
          image: true,
        },
      },
      where,
      depth: 4,
    });

    // 키워드가 있다면 필터링
    if (searchCondition.productName) {
      const filteredOrderList = orderList.filter((order) => {
        const orderProducts = order.orderProducts?.docs as OrderProduct[];

        if (!orderProducts || orderProducts.length === 0) {
          return false;
        }

        let keywordContainFlg = false;
        orderProducts.forEach((orderProduct) => {
          if (orderProduct.productNameSnapshot?.includes(searchCondition.productName)) {
            keywordContainFlg = true;
          }
        });

        return keywordContainFlg;
      });

      return {
        success: true,
        data: filteredOrderList.map((order) =>
          normalizeOrder(order as OrderListItemBeforeNormalize),
        ),
      };
    }

    return {
      success: true,
      data: orderList.map((order) => normalizeOrder(order as OrderListItemBeforeNormalize)),
    };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, message: '주문내역을 조회하는데 문제가 발생했습니다' };
  }
};
