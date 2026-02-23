'use server';

import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { getPayload } from '@/shared/lib/get-payload';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import {
  statusToPreparingHandler as statusToPreparingOrderProductHandler,
  updateOrderProductStatusHandler,
} from '@/entities/order-product/lib/status-handler';
import { User } from '@/entities/user';
import { PAYMENT_STATUS, PaymentStatus } from '@/entities/order/constants/payment-status';
import { FlgStatus } from '@/entities/order/constants/flg-status';

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

export const validateContext = async ({
  orderProductIds,
  orderId,
  userId,
}: {
  orderProductIds: number[];
  orderId: number;
  userId: number;
}) => {
  const payload = await getPayload();
  // const targetOrderProducts = await payload.findByID({
  //   collection: 'order',
  //   id: orderId,
  //   select: {
  //     paymentStatus: true,
  //     orderStatus: true,
  //     paymentsMethod: true,
  //   },
  // });

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

  // if (targetOrderProducts.paymentsMethod !== PAYMENTS_METHOD.BANK_TRANSFER) {
  //   return {
  //     success: false,
  //     message: '무통장입금 결제에서만 사용가능한 기능입니다.',
  //   };
  // }

  // if (targetOrderProducts.orderStatus === ORDER_STATUS.PREPARING) {
  //   return {
  //     success: false,
  //     message: '이미 상품준비중 상태입니다.',
  //   };
  // }

  // if (targetOrderProducts.orderStatus !== ORDER_STATUS.PENDING) {
  //   return {
  //     success: false,
  //     message: '상품준비중 상태는 입금확인중 상태에서만 변경할 수 있습니다.',
  //   };
  // }

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
}: {
  orderId: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}) => {
  const payload = await getPayload();

  await payload.update({
    collection: 'order',
    id: orderId,
    data: {
      orderStatus,
      paymentStatus,
    },
  });
};
