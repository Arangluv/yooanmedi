import { createCancelUsePointTransaction } from '@/entities/point/lib/cancel-use/create-transaction';
import { ORDER_PRODUCT_STATUS, OrderProductStatus } from '../constants/order-product-status';
import { createEarnPointTransaction } from '@/entities/point/lib/earn/create-transaction'; // TODO:: 이 부분 참조 잘못됨 -> 개선필요
import { getPayload } from '@/shared/lib/get-payload';
import { createCancelEarnPointTransaction } from '@/entities/point/lib/cancel-earn/create-transaction';
import { cancelOrderProduct } from '@/features/order/order-cancel/api/cancel-order-product';

type OrderProductStatusHandlerParams = {
  orderProductId: number;
  userId: number;
};

export const statusToPreparingHandler = {
  validate: async (orderProductId: number) => {
    const payload = await getPayload();

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        orderProductStatus: true,
      },
    });

    if (!orderProduct) {
      return {
        success: false,
        message: '주문 상품을 찾을 수 없습니다.',
      };
    }

    if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.PREPARING) {
      return {
        success: false,
        message: '이미 상품준비중 상태입니다.',
      };
    }

    if (orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.PENDING) {
      return {
        success: false,
        message: '상품준비중 상태는 입금확인중 상태에서만 변경할 수 있습니다.',
      };
    }

    return {
      success: true,
    };
  },

  changeStatusToPreparing: async ({ orderProductId, userId }: OrderProductStatusHandlerParams) => {
    const payload = await getPayload();

    const orderProduct = await payload.update({
      collection: 'order-product',
      id: orderProductId,
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.PREPARING,
      },
    });

    // TODO:: getPointWhenUsingBankTransfer 함수가 있지만 params 타입이 다음
    // product와 snapshot product는 다른 도메인 객체다
    // 한번에 관리가 되도록 할 수는 없을까?
    const pointAmount =
      Math.floor((orderProduct.cashback_rate_for_bank / 100) * orderProduct.priceSnapshot) *
      orderProduct.quantity;

    await createEarnPointTransaction({
      userId,
      orderProductId,
      amount: pointAmount,
    });
  },
};

export const beforePaymentToCancelledHandler = {
  validate: async (orderProductId: number) => {
    const payload = await getPayload();

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        orderProductStatus: true,
      },
    });

    if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCELLED) {
      return {
        success: false,
        message: '이미 주문취소 된 상품입니다',
      };
    }

    if (orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.PENDING) {
      return {
        success: false,
        message: '입금확인중 상태에서만 취소할 수 있습니다.',
      };
    }

    return {
      success: true,
    };
  },

  changeStatusToCancelled: async ({ orderProductId }: { orderProductId: number }) => {
    const payload = await getPayload();

    await payload.update({
      collection: 'order-product',
      id: orderProductId,
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.CANCELLED,
      },
    });
  },
};

export const paidOrderToCancelledHandler = {
  validate: async (orderProductId: number) => {
    const payload = await getPayload();

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        orderProductStatus: true,
      },
    });

    if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCELLED) {
      return {
        success: false,
        message: '이미 주문취소 된 상품입니다',
      };
    }

    return {
      success: true,
    };
  },

  changeStatusToCancelled: async ({ orderProductId }: { orderProductId: number }) => {
    await cancelOrderProduct({ orderProductId, clientSideFlg: false });
  },
};

export const cancelRequestToCancelledHandler = {
  validate: async (orderProductId: number) => {
    const payload = await getPayload();

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        orderProductStatus: true,
      },
    });

    if (!orderProduct) {
      return {
        success: false,
        message: '주문 상품을 찾을 수 없습니다.',
      };
    }

    if (orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.CANCELLED) {
      return {
        success: false,
        message: '이미 주문취소 된 상품입니다',
      };
    }

    return {
      success: true,
    };
  },
  changeStatusToCancelled: async ({ orderProductId, userId }: OrderProductStatusHandlerParams) => {
    const payload = await getPayload();

    const orderProduct = await payload.update({
      collection: 'order-product',
      id: orderProductId,
      select: {
        order: true,
      },
      populate: {
        order: {
          usedPoint: true,
        },
      },
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.CANCELLED,
      },
    });

    if (typeof orderProduct.order === 'number') {
      return {
        success: false,
        message: '주문을 취소하는데 문제가 발생했습니다',
      };
    }

    const { id: orderId, usedPoint } = orderProduct.order;

    // 사용한 적립금 환불 처리
    if (usedPoint > 0) {
      await createCancelUsePointTransaction({
        userId,
        orderProductId,
      });
    }

    // 적립된 적립금 환수 처리
    await createCancelEarnPointTransaction({
      userId,
      orderProductId,
    });
  },
};

export const updateOrderProductStatusHandler = {
  async validate({
    orderProductId,
    orderStatus,
  }: {
    orderProductId: number;
    orderStatus: OrderProductStatus;
  }) {
    const payload = await getPayload();

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        orderProductStatus: true,
      },
    });

    if (!orderProduct) {
      return {
        success: false,
        message: '주문 상품을 찾을 수 없습니다.',
      };
    }

    if (orderProduct.orderProductStatus === orderStatus) {
      return {
        success: false,
        message: `이미 ${orderStatus} 상태입니다.`,
      };
    }

    return {
      success: true,
    };
  },

  updateStatus: async ({
    orderProductId,
    orderStatus,
  }: {
    orderProductId: number;
    orderStatus: OrderProductStatus;
  }) => {
    const payload = await getPayload();

    await payload.update({
      collection: 'order-product',
      id: orderProductId,
      data: {
        orderProductStatus: orderStatus,
      },
    });
  },
};
