import { STATUS_SCENARIO, statusUpdateScenario } from '@/features/order/admin/lib/status-scenario';
import { CANCEL_SCENARIO } from '../../constants/scenario';
import { ORDER_STATUS } from '@/entities/order/constants/order-status';

export const cancelAction = {
  [CANCEL_SCENARIO.BEFORE_PAYMENT_TO_CANCELLED]: async ({
    targetOrderIds,
  }: {
    targetOrderIds: number[];
  }) => {
    for (const targetOrderId of targetOrderIds) {
      await statusUpdateScenario[STATUS_SCENARIO.BEFORE_PAYMENT_TO_CANCELLED]({
        orderId: targetOrderId,
        orderStatus: ORDER_STATUS.PENDING,
      });
    }
  },
  [CANCEL_SCENARIO.PAID_ORDER_TO_CANCELLED]: async ({
    targetOrderIds,
  }: {
    targetOrderIds: number[];
  }) => {
    // 캔슬 처리 로직
  },
  [CANCEL_SCENARIO.CANCEL_REQUEST_TO_CANCELLED]: async ({
    targetOrderIds,
  }: {
    targetOrderIds: number[];
  }) => {
    for (const targetOrderId of targetOrderIds) {
      await statusUpdateScenario[STATUS_SCENARIO.CANCEL_REQUEST_TO_CANCELLED]({
        orderId: targetOrderId,
        orderStatus: ORDER_STATUS.CANCEL_REQUEST,
      });
    }
  },
};
