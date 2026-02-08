'use server';

import type { Order } from '@/entities/order';
import { getPayload } from '@/shared';

import { OrderListSearchParamsType } from '../model/sever-search-params';

type OrderListDto = {
  userId: number;
  searchParams: OrderListSearchParamsType;
};

type OrderListSuccessResponse = {
  success: true;
  data: Array<Pick<Order, 'id' | 'orderCreatedAt' | 'quantity' | 'product'>>;
};

type OrderListErrorResponse = {
  success: false;
  message: string;
};

export type OrderListResponse = OrderListSuccessResponse | OrderListErrorResponse;

export const getOrderList = async ({
  userId,
  searchParams,
}: OrderListDto): Promise<OrderListResponse> => {
  try {
    const payload = await getPayload();

    const { docs: orderList } = await payload.find({
      collection: 'order',
      select: {
        id: true,
        quantity: true,
        product: true,
        price: true,
        delivery_fee: true,
        cashback_rate: true,
        cashback_rate_for_bank: true,
        orderStatus: true,
        orderCreatedAt: true,
      },
      where: {
        user: {
          equals: userId,
        },
      },
      populate: {
        product: {
          name: true,
          manufacturer: true,
          specification: true,
        },
      },
      sort: 'createdAt',
      limit: 0,
    });
    return { success: true, data: orderList } as OrderListSuccessResponse;
  } catch (error) {
    return {
      success: false,
      message: '주문내역을 조회하는데 문제가 발생했습니다',
    } as OrderListErrorResponse;
  }
};
