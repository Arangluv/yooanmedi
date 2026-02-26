import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { UPDATE_SCENARIO } from '../../constants/scenario';
import { statusUpdateScenario } from '@/features/order/admin/lib/status-scenario';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { updateOrderStatus } from '@/features/order/admin/lib/order-status-handler';

export const updateAction = {
  [UPDATE_SCENARIO.PENDING_TO_PREPARING]: async ({
    targetOrderIds,
  }: {
    targetOrderIds: number[];
  }) => {
    // Pending To Preparing
    for (const targetOrderId of targetOrderIds) {
      await statusUpdateScenario[UPDATE_SCENARIO.PENDING_TO_PREPARING]({
        orderStatus: ORDER_STATUS.PENDING, // TODO :: 왜 currentStatus를 넘겨줘야하는지 이해하는데 오래걸림 -> refactoring 필요
        orderId: targetOrderId,
      });
    }

    return {
      success: true,
      message: '주문 상태가 변경되었습니다',
    };
  },
  [UPDATE_SCENARIO.PREPARING_TO_SHIPPING]: async ({
    targetOrderIds,
  }: {
    targetOrderIds: number[];
  }) => {
    // Preparing To Shipping
    for (const targetOrderId of targetOrderIds) {
      await statusUpdateScenario[UPDATE_SCENARIO.PREPARING_TO_SHIPPING]({
        orderStatus: ORDER_STATUS.PREPARING,
        orderId: targetOrderId,
      });
    }

    return {
      success: true,
      message: '주문 상태가 변경되었습니다',
    };
  },
  [UPDATE_SCENARIO.SHIPPING_TO_DELIVERED]: async ({
    targetOrderIds,
  }: {
    targetOrderIds: number[];
  }) => {
    // Shipping To Delivered
    for (const targetOrderId of targetOrderIds) {
      await statusUpdateScenario[UPDATE_SCENARIO.SHIPPING_TO_DELIVERED]({
        orderStatus: ORDER_STATUS.SHIPPING,
        orderId: targetOrderId,
      });
    }

    return {
      success: true,
      message: '주문 상태가 변경되었습니다',
    };
  },
};
