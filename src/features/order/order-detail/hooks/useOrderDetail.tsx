import { useQuery } from '@tanstack/react-query';
import { BaseError, formatNumberWithCommas, PAYMENTS_METHOD_NAME } from '@/shared';
import {
  getPaymentStatus,
  ORDER_QUERY_KEYS,
  OrderStatus,
  PAYMENT_STATUS_NAME,
} from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { getOrderDetailApi } from '../api';

export const useOrderDetail = (orderId: number) => {
  const { data: result } = useQuery({
    queryFn: () => getOrderDetailApi({ order: orderId }),
    queryKey: ORDER_QUERY_KEYS.detail(orderId),
  });

  if (!result) {
    throw new BaseError({
      clientMsg: '상세 주문내역을 불러오는데 문제가 발생했습니다',
      devMsg: 'useOrderDetailQuery는 QueryHydrationProvider 내부에서 사용해야 합니다',
      errorName: 'OrderDetailError',
    });
  }

  if (!result.isSuccess) {
    throw new BaseError({
      clientMsg: '상세 주문내역을 불러오는데 문제가 발생했습니다',
      devMsg: result.message,
      errorName: 'OrderDetailError',
    });
  }

  const getProgressdOrderProductContext = () => {
    const orderProducts = result.data.orderProducts.filter(
      (orderProduct) =>
        orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancel_request &&
        orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancelled,
    );

    const statusSet = new Set();
    orderProducts.forEach((orderProducts) => {
      statusSet.add(orderProducts.orderProductStatus);
    });

    if (statusSet.size === 0) {
      return { orderProducts, status: null };
    }

    if (statusSet.size > 1) {
      throw new Error('orderProduct 상태는 중복될 수 없습니다');
    }
    const currentStatus = statusSet.values().next().value as OrderStatus;

    return { orderProducts, status: currentStatus };
  };

  const getCancelRequestOrderProductContext = () => {
    const orderProducts = result.data.orderProducts.filter(
      (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancel_request,
    );

    return { orderProducts, status: ORDER_PRODUCT_STATUS.cancel_request };
  };

  const getCancelledProductContext = () => {
    const orderProducts = result.data.orderProducts.filter(
      (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled,
    );

    return { orderProducts, status: ORDER_PRODUCT_STATUS.cancelled };
  };

  const getPaymentViewStatus = () => {
    const orderProductStatus = result.data.orderProducts.map((item) => item.orderProductStatus);
    const paymentStatus = getPaymentStatus(result.data.orderStatus, orderProductStatus);
    return paymentStatus;
  };

  const getTotalPrice = () => {
    let totalPrice = result.data.finalPrice;
    result.data.orderProducts.forEach((orderProduct) => {
      if (
        orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancel_request ||
        orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled
      ) {
        totalPrice -= orderProduct.totalAmount;
      }
    });

    return totalPrice;
  };

  return {
    orderDetail: result.data,
    getProgressdOrderProductContext,
    getCancelRequestOrderProductContext,
    getCancelledProductContext,
    deliveryInfo: {
      address: result.data.user.address,
      orderRequest: result.data.orderRequest || '요청사항 없음',
    },
    paymentsInfo: {
      paymentMethod: PAYMENTS_METHOD_NAME[result.data.paymentsMethod],
      paymentStatus: PAYMENT_STATUS_NAME[getPaymentViewStatus()],
      usedPoint: formatNumberWithCommas(result.data.usedPoint),
      finalPrice: formatNumberWithCommas(getTotalPrice()),
    },
    user: result.data.user,
  };
};
