'use client';

import useOrderDetailQuery from './useOrderDetailQuery';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';

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
    const currentStatus = statusSet.values().next().value;

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
  };
};

export default useOrderDetail;
