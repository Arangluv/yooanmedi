import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import {
  changeOrderListStatusToPreparing,
  getTargetOrderProductIds,
  validateContext,
  updateOrderStatus,
  getOrderUserId,
  updateOrderListStatus,
  cancelRequestToCancelled,
  checkAllOrderProductCancelled,
} from './order-status-handler';
import { validateBeforeAction } from './validate';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';

export const STATUS_SCENARIO = {
  PENDING_TO_PREPARING: 'PENDING_TO_PREPARING',
  PREPARING_TO_SHIPPING: 'PREPARING_TO_SHIPPING',
  SHIPPING_TO_DELIVERED: 'SHIPPING_TO_DELIVERED',
  CANCEL_REQUEST_TO_CANCELLED: 'CANCEL_REQUEST_TO_CANCELLED',
} as const;

export type StatusScenario = (typeof STATUS_SCENARIO)[keyof typeof STATUS_SCENARIO];

export const getStatusScenario = (orderStatus: OrderStatus | null) => {
  if (!orderStatus) {
    throw new Error('주문 상태가 선택되지 않았습니다.');
  }

  switch (orderStatus) {
    case ORDER_STATUS.PENDING:
      return STATUS_SCENARIO.PENDING_TO_PREPARING;
    case ORDER_STATUS.PREPARING:
      return STATUS_SCENARIO.PREPARING_TO_SHIPPING;
    case ORDER_STATUS.SHIPPING:
      return STATUS_SCENARIO.SHIPPING_TO_DELIVERED;
    case ORDER_STATUS.CANCEL_REQUEST:
      return STATUS_SCENARIO.CANCEL_REQUEST_TO_CANCELLED;
  }

  throw new Error('주문 상태가 존재하지 않습니다.');
};

const getChangeOrderStatusContext = async (orderId: number, orderStatus: OrderStatus) => {
  const userId = await getOrderUserId(orderId);
  const orderProductIds = await getTargetOrderProductIds(orderId, orderStatus);

  const validateResult = await validateContext({
    orderProductIds,
    userId,
  });

  if (!validateResult.success) {
    throw new Error(validateResult.message);
  }

  return {
    userId,
    orderProductIds,
  };
};

export const statusUpdateScenario = {
  [STATUS_SCENARIO.PENDING_TO_PREPARING]: async ({
    orderStatus,
    orderId,
  }: {
    orderStatus: OrderStatus;
    orderId: number;
  }) => {
    const { userId, orderProductIds } = await getChangeOrderStatusContext(orderId, orderStatus);
    const validateBeforeActionResult = await validateBeforeAction({
      orderId,
      currentOrderStatus: orderStatus,
    });

    if (!validateBeforeActionResult.success) {
      throw new Error(validateBeforeActionResult.message);
    }

    const changeOrderProductStatusToPreparingResult = await changeOrderListStatusToPreparing({
      orderProductIds,
      userId,
    });

    if (!changeOrderProductStatusToPreparingResult.success) {
      throw new Error(changeOrderProductStatusToPreparingResult.message);
    }

    await updateOrderStatus({
      orderId,
      orderStatus: ORDER_STATUS.PREPARING,
      paymentStatus: PAYMENT_STATUS.COMPLETE,
    });
  },
  [STATUS_SCENARIO.PREPARING_TO_SHIPPING]: async ({
    orderStatus,
    orderId,
  }: {
    orderStatus: OrderStatus;
    orderId: number;
  }) => {
    const { orderProductIds } = await getChangeOrderStatusContext(orderId, orderStatus);
    const validateBeforeActionResult = await validateBeforeAction({
      orderId,
      currentOrderStatus: orderStatus,
    });

    if (!validateBeforeActionResult.success) {
      throw new Error(validateBeforeActionResult.message);
    }

    const updateOrderListStatusResult = await updateOrderListStatus({
      orderProductIds,
      orderStatus: ORDER_STATUS.SHIPPING,
    });

    if (!updateOrderListStatusResult.success) {
      throw new Error(updateOrderListStatusResult.message);
    }

    await updateOrderStatus({
      orderId,
      orderStatus: ORDER_STATUS.SHIPPING,
      paymentStatus: PAYMENT_STATUS.COMPLETE,
    });
  },
  [STATUS_SCENARIO.SHIPPING_TO_DELIVERED]: async ({
    orderId,
    orderStatus,
  }: {
    orderId: number;
    orderStatus: OrderStatus;
  }) => {
    const { orderProductIds } = await getChangeOrderStatusContext(orderId, orderStatus);

    const validateBeforeActionResult = await validateBeforeAction({
      orderId,
      currentOrderStatus: orderStatus,
    });

    if (!validateBeforeActionResult.success) {
      throw new Error(validateBeforeActionResult.message);
    }

    const updateOrderListStatusResult = await updateOrderListStatus({
      orderProductIds,
      orderStatus: ORDER_STATUS.DELIVERED,
    });

    if (!updateOrderListStatusResult.success) {
      throw new Error(updateOrderListStatusResult.message);
    }

    await updateOrderStatus({
      orderId,
      orderStatus: ORDER_STATUS.DELIVERED,
      paymentStatus: PAYMENT_STATUS.COMPLETE, // todo:: Paymentstatus를 넘겨줄 필요가 있을까? 해당 시점에서는 반드시 complete다
    });
  },

  [STATUS_SCENARIO.CANCEL_REQUEST_TO_CANCELLED]: async ({
    orderId,
    orderStatus,
  }: {
    orderId: number;
    orderStatus: OrderStatus;
  }) => {
    const { orderProductIds, userId } = await getChangeOrderStatusContext(orderId, orderStatus);

    const validateBeforeActionResult = await validateBeforeAction({
      orderId,
      currentOrderStatus: orderStatus,
    });

    if (!validateBeforeActionResult.success) {
      throw new Error(validateBeforeActionResult.message);
    }

    const cancelRequestToCancelledResult = await cancelRequestToCancelled({
      orderProductIds,
      userId,
    });

    if (!cancelRequestToCancelledResult.success) {
      throw new Error(cancelRequestToCancelledResult.message);
    }

    // 취소 액션에서는 전체취소처리 해야하는지 부분 취소 처리해야하는지에 대한 정보가 필요하다
    const isAllOrderProductCancelled = await checkAllOrderProductCancelled(orderId);

    if (isAllOrderProductCancelled) {
      await updateOrderStatus({
        orderId,
        orderStatus: ORDER_STATUS.CANCELLED,
        flgStatus: FLG_STATUS.COMPLETE,
        paymentStatus: PAYMENT_STATUS.TOTAL_CANCEL,
      });
    } else {
      await updateOrderStatus({
        orderId,
        flgStatus: FLG_STATUS.COMPLETE,
        paymentStatus: PAYMENT_STATUS.PARTIAL_CANCEL,
      });
    }
  },
};
