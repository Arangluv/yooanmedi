'use server';

import { Where } from 'payload';

import type { User } from '@/entities/user';
import { OrderProduct } from '@/entities/order-product';
import { Order } from '@/entities/order';
import { getPayload } from '@/shared';

import type { OrderListSearchParamsType } from '../model/sever-search-params';
import { orderListSchema } from '../model/order-list-schema';
import { normalizeOrder, OrderListItem } from '../lib/normalization';

type GetOrdersDto = {
  user: User | null;
  searchParams: OrderListSearchParamsType;
};

export type OrderListItemBeforeNormalize = Pick<
  Order,
  'id' | 'paymentsMethod' | 'orderStatus' | 'orderNo' | 'finalPrice'
> & {
  orderProducts: {
    docs: Pick<
      OrderProduct,
      | 'id'
      | 'product'
      | 'orderProductStatus'
      | 'productNameSnapshot'
      | 'priceSnapshot'
      | 'productDeliveryFee'
      | 'quantity'
    >[];
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
      },
      populate: {
        'order-product': {
          productNameSnapshot: true,
          priceSnapshot: true,
          product: true,
          quantity: true,
          productDeliveryFee: true,
          orderProductStatus: true,
        },
      },
      where,
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
