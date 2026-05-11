import { ORDER_STATUS, ORDER_STATUS_NAME, type OrderStatus } from '@/entities/order';
import type { DialogConfig } from '@/views/admin/order-detail/config/dialog.config';

export const TRANSITION_DIALOG_CONFIG: Record<OrderStatus, DialogConfig | null> = {
  [ORDER_STATUS.pending]: {
    triggerText: `${getNextOrderStatusText(ORDER_STATUS.pending)} 처리`,
    headerTitle: `주문을 ${getNextOrderStatusText(ORDER_STATUS.pending)}로 변경하시겠습니까?`,
    description: `주문 상태가 ${getNextOrderStatusText(ORDER_STATUS.pending)}로 변경됩니다 `,
    action: {
      text: `${getNextOrderStatusText(ORDER_STATUS.pending)} 처리`,
      onClick: () => {},
    },
  },
  [ORDER_STATUS.preparing]: {
    triggerText: `${getNextOrderStatusText(ORDER_STATUS.preparing)} 처리`,
    headerTitle: `주문을 ${getNextOrderStatusText(ORDER_STATUS.preparing)}으로 변경하시겠습니까?`,
    description: `주문 상태가 ${getNextOrderStatusText(ORDER_STATUS.preparing)}으로 변경됩니다 `,
    action: {
      text: `${getNextOrderStatusText(ORDER_STATUS.preparing)} 처리`,
      onClick: () => {},
    },
  },
  [ORDER_STATUS.shipping]: {
    triggerText: `${getNextOrderStatusText(ORDER_STATUS.shipping)} 처리`,
    headerTitle: `주문을 ${getNextOrderStatusText(ORDER_STATUS.shipping)}로 변경하시겠습니까?`,
    description: `주문 상태가 ${getNextOrderStatusText(ORDER_STATUS.shipping)}로 변경됩니다 `,
    action: {
      text: `${getNextOrderStatusText(ORDER_STATUS.shipping)} 처리`,
      onClick: () => {},
    },
  },
  [ORDER_STATUS.delivered]: null,
  [ORDER_STATUS.cancel_request]: null,
  [ORDER_STATUS.cancelled]: null,
};

function getNextOrderStatusText(currentStatus: OrderStatus): string {
  switch (currentStatus) {
    case ORDER_STATUS.pending:
      return ORDER_STATUS_NAME[ORDER_STATUS.preparing];
    case ORDER_STATUS.preparing:
      return ORDER_STATUS_NAME[ORDER_STATUS.shipping];
    case ORDER_STATUS.shipping:
      return ORDER_STATUS_NAME[ORDER_STATUS.delivered];
    default:
      throw new Error('해당 주문상태에서는 변경할 수 없습니다');
  }
}
