'use client';

import { formatNumberWithCommas } from '@/shared';
import { OrderStatus, PAYMENT_STATUS_NAME, PAYMENTS_METHOD_NAME } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import useOrderDetailQuery from './useOrderDetailQuery';

const useOrderDetail = (orderId: number) => {
  const { data } = useOrderDetailQuery(orderId);

  const getProgressdOrderProductContext = () => {
    const orderProducts = data.orderProducts.filter(
      (orderProduct) =>
        orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancel_request &&
        orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancelled,
    );

    const statusSet = new Set();
    orderProducts.forEach((orderProducts) => {
      statusSet.add(orderProducts.orderProductStatus);
    });
    if (statusSet.size > 1) {
      throw new Error('orderProduct 상태는 중복될 수 없습니다');
    }
    const currentStatus = statusSet.values().next().value as OrderStatus;

    return { orderProducts, status: currentStatus };
  };

  const getCancelRequestOrderProductContext = () => {
    const orderProducts = data.orderProducts.filter(
      (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancel_request,
    );

    return { orderProducts, status: ORDER_PRODUCT_STATUS.cancel_request };
  };

  const getCancelledProductContext = () => {
    const orderProducts = data.orderProducts.filter(
      (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled,
    );

    return { orderProducts, status: ORDER_PRODUCT_STATUS.cancelled };
  };

  return {
    orderDetail: data,
    getProgressdOrderProductContext,
    getCancelRequestOrderProductContext,
    getCancelledProductContext,
    deliveryInfo: {
      address: data.user.address,
      orderRequest: data.orderRequest || '요청사항 없음',
    },
    paymentsInfo: {
      paymentMethod: PAYMENTS_METHOD_NAME[data.paymentsMethod],
      paymentStatus: PAYMENT_STATUS_NAME[data.paymentStatus],
      usedPoint: formatNumberWithCommas(data.usedPoint),
      finalPrice: formatNumberWithCommas(data.finalPrice),
    },
    user: data.user,
  };
};

export default useOrderDetail;
