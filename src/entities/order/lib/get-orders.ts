'use server';

import { Where } from 'payload';
import { getPayload } from '@/shared';
import { OrderStatus } from '../constants/order-status';

// TODO :: 반드시 리팩토링 해야함
export const getOrders = async (orderStatus: OrderStatus | 'all', page: number) => {
  try {
    const payload = await getPayload();

    const where: Where = {};
    if (orderStatus !== 'all') {
      where.orderStatus = {
        equals: orderStatus,
      };
    }

    const orders = await payload.find({
      collection: 'order',
      select: {
        user: true,
        orderNo: true,
        orderStatus: true,
        paymentStatus: true,
        flgStatus: true,
        finalPrice: true,
        paymentsMethod: true,
        createdAt: true,
      },
      populate: {
        users: {
          hospitalName: true,
        },
      },
      where,
      page,
      limit: 25,
    });

    return orders;
  } catch (error) {
    // TODO :: error 처리
    return {
      success: false,
      message: '주문 내역을 가져오는데 실패했습니다',
    };
  }
};
