import { type AlertDialogConfig } from '@/shared';
import { ORDER_STATUS, ORDER_STATUS_NAME, type OrderStatus } from '@/entities/order';

export const getTransitionDialogConfig = (
  currentStatus: OrderStatus,
  count: number,
): AlertDialogConfig => {
  const templateTriggerText = (status: string) => `${status} 처리`;
  const templateHeaderTitleText = (statusWithPrefix: string) =>
    `${count}개 주문을 ${statusWithPrefix} 변경하시겠습니까?`;
  const templateDescText = (statusWithPrefix: string) =>
    `주문 상태가 ${statusWithPrefix} 일괄 변경됩니다 `;

  switch (currentStatus) {
    case ORDER_STATUS.pending: {
      const nextStatus = getNextOrderStatusText(ORDER_STATUS.pending);

      return {
        triggerText: templateTriggerText(nextStatus),
        headerTitle: templateHeaderTitleText(`${nextStatus}로`),
        description: templateDescText(`${nextStatus}로`),
        action: {
          text: templateTriggerText(nextStatus),
          onClick: () => {},
        },
      };
    }

    case ORDER_STATUS.preparing: {
      const nextStatus = getNextOrderStatusText(ORDER_STATUS.preparing);

      return {
        triggerText: templateTriggerText(nextStatus),
        headerTitle: templateHeaderTitleText(`${nextStatus}으로`),
        description: templateDescText(`${nextStatus}으로`),
        action: {
          text: templateTriggerText(nextStatus),
          onClick: () => {},
        },
      };
    }

    case ORDER_STATUS.shipping: {
      const nextStatus = getNextOrderStatusText(ORDER_STATUS.shipping);

      return {
        triggerText: templateTriggerText(nextStatus),
        headerTitle: templateHeaderTitleText(`${nextStatus}로`),
        description: templateDescText(`${nextStatus}로`),
        action: {
          text: templateTriggerText(nextStatus),
          onClick: () => {},
        },
      };
    }

    default:
      throw new Error('해당 주문상태에서는 변경할 수 없습니다');
  }
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
