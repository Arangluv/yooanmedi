'use server';

import { OrderStatus } from '@/entities/order/constants/order-status';
import { getPayload } from '@/shared/lib/get-payload';
import {
  cancelRequestToCancelledHandler,
  statusToPreparingHandler as statusToPreparingOrderProductHandler,
  updateOrderProductStatusHandler,
} from '@/entities/order-product/lib/status-handler';
import { User } from '@/entities/user';
import { PaymentStatus } from '@/entities/order/constants/payment-status';
import { FlgStatus } from '@/entities/order/constants/flg-status';
import { Order } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, OrderProduct } from '@/entities/order-product';

export const getTargetOrderProductIds = async (orderId: number, orderStatus: OrderStatus) => {
  const payload = await getPayload();
  const orderProducts = await payload.find({
    collection: 'order-product',
    select: {}, // TODO:: 이 부분 개선할 수 없을까. 이렇게 적으면 id만 넘어오지만 왜 이렇게 적어야하는지에 대한 이유를 알 수 없다.
    where: {
      order: {
        equals: orderId,
      },
      orderProductStatus: {
        equals: orderStatus,
      },
    },
  });

  return orderProducts.docs.map((orderProduct) => orderProduct.id);
};

export const getOrderUserId = async (orderId: number) => {
  const payload = await getPayload();
  const order = await payload.findByID({
    collection: 'order',
    id: orderId,
    select: {
      user: true,
    },
    populate: {
      users: {}, // TODO:: 이 부분 개선할 수 없을까. 이렇게 적으면 id만 넘어오지만 왜 이렇게 적어야하는지에 대한 이유를 알 수 없다.
    },
  });

  return (order.user as User).id;
};

export const checkAllOrderProductCancelled = async (orderId: number) => {
  const payload = await getPayload();
  const order = await payload.findByID({
    collection: 'order',
    id: orderId,
    select: {
      orderProducts: true,
    },
    populate: {
      'order-product': {
        orderProductStatus: true,
      },
    },
  });

  const orderProducts = order.orderProducts?.docs as OrderProduct[];

  console.log('orderProducts는?');
  console.log(orderProducts);

  const test = orderProducts?.every(
    (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCELLED,
  );

  console.log('모든 품목이?');
  console.log(test);

  return orderProducts?.every(
    (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCELLED,
  );
};

export const validateContext = async ({
  orderProductIds,
  userId,
}: {
  orderProductIds: number[];
  userId: number;
}) => {
  if (!userId) {
    return {
      success: false,
      message: '주문자 정보를 찾을 수 없습니다',
    };
  }

  if (orderProductIds.length === 0) {
    return {
      success: false,
      message: '변경하려는 주문 상품이 존재하지 않습니다',
    };
  }

  return {
    success: true,
  };
};

export const changeOrderListStatusToPreparing = async ({
  orderProductIds,
  userId,
}: {
  orderProductIds: number[];
  userId: number;
}) => {
  for (const orderProductId of orderProductIds) {
    const validateResult = await statusToPreparingOrderProductHandler.validate(orderProductId);
    if (!validateResult.success) {
      return {
        success: false,
        message: validateResult.message,
      };
    }

    await statusToPreparingOrderProductHandler.changeStatusToPreparing({
      orderProductId,
      userId,
    });
  }

  return {
    success: true,
  };
};

export const cancelRequestToCancelled = async ({
  orderProductIds,
  userId,
}: {
  orderProductIds: number[];
  userId: number;
}) => {
  for (const orderProductId of orderProductIds) {
    const validateResult = await cancelRequestToCancelledHandler.validate(orderProductId);

    if (!validateResult.success) {
      return {
        success: false,
        message: validateResult.message,
      };
    }

    await cancelRequestToCancelledHandler.changeStatusToCancelled({
      orderProductId,
      userId,
    });
  }

  return {
    success: true,
  };
};

export const updateOrderListStatus = async ({
  orderProductIds,
  orderStatus,
}: {
  orderProductIds: number[];
  orderStatus: OrderStatus;
}) => {
  for (const orderProductId of orderProductIds) {
    const validateResult = await updateOrderProductStatusHandler.validate({
      orderProductId,
      orderStatus,
    });
    if (!validateResult.success) {
      return {
        success: false,
        message: validateResult.message,
      };
    }

    await updateOrderProductStatusHandler.updateStatus({
      orderProductId,
      orderStatus,
    });
  }

  return {
    success: true,
  };
};

export const updateOrderStatus = async ({
  orderId,
  orderStatus,
  paymentStatus,
  flgStatus,
}: {
  orderId: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  flgStatus?: FlgStatus;
}) => {
  const payload = await getPayload();

  const data = {} as Order;

  if (orderStatus) {
    data.orderStatus = orderStatus;
  }

  if (flgStatus) {
    data.flgStatus = flgStatus;
  }

  if (paymentStatus) {
    data.paymentStatus = paymentStatus;
  }

  await payload.update({
    collection: 'order',
    id: orderId,
    data,
  });
};
