'use server';

import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { getPayload } from '@/shared/lib/get-payload';

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

export const validateBeforeAction = async ({
  orderId,
  currentOrderStatus,
}: {
  orderId: number;
  currentOrderStatus: OrderStatus;
}) => {
  const payload = await getPayload();

  const targetOrder = await payload.findByID({
    collection: 'order',
    id: orderId,
    select: {
      orderStatus: true,
      paymentsMethod: true,
    },
  });

  switch (currentOrderStatus) {
    case ORDER_STATUS.PENDING:
      if (targetOrder.paymentsMethod !== PAYMENTS_METHOD.BANK_TRANSFER) {
        return {
          success: false,
          message: '무통장입금 결제에서만 사용가능한 기능입니다.',
        };
      }

      if (targetOrder.orderStatus === ORDER_STATUS.PREPARING) {
        return {
          success: false,
          message: '이미 상품준비중 상태입니다.',
        };
      }

      if (targetOrder.orderStatus !== ORDER_STATUS.PENDING) {
        return {
          success: false,
          message: '상품준비중 상태는 입금확인중 상태에서만 변경할 수 있습니다.',
        };
      }
      break;
    case ORDER_STATUS.PREPARING:
      if (targetOrder.orderStatus === ORDER_STATUS.SHIPPING) {
        return {
          success: false,
          message: '이미 배송중 상태입니다.',
        };
      }
      break;
    case ORDER_STATUS.SHIPPING:
      if (targetOrder.orderStatus === ORDER_STATUS.DELIVERED) {
        return {
          success: false,
          message: '이미 배송완료 상태입니다.',
        };
      }
      break;
    case ORDER_STATUS.CANCEL_REQUEST:
      if (targetOrder.orderStatus === ORDER_STATUS.CANCELLED) {
        return {
          success: false,
          message: '이미 주문취소 상태입니다.',
        };
      }
      break;
  }

  return { success: true };
};
