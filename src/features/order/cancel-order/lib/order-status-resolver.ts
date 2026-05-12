import { ORDER_PRODUCT_STATUS, type OrderProductStatus } from '@/entities/order-product';
import { BusinessLogicError } from '@/shared';

export const getUpdateOrderStatus = (statuses: OrderProductStatus[]) => {
  if (hasCancelRequestStatus(statuses)) {
    return ORDER_PRODUCT_STATUS.cancel_request;
  }

  if (isFullyCancelled(statuses)) {
    return ORDER_PRODUCT_STATUS.cancelled;
  }

  return getOnGoingStatus(statuses);
};

function hasCancelRequestStatus(statuses: OrderProductStatus[]) {
  return statuses.includes(ORDER_PRODUCT_STATUS.cancel_request);
}

function isFullyCancelled(statuses: OrderProductStatus[]) {
  return statuses.every((status) => status === ORDER_PRODUCT_STATUS.cancelled);
}

/**
 * @example ["cancelled", "cancelled", "preparing", "preparing"]
 * @returns "preparing"
 */
function getOnGoingStatus(statuses: OrderProductStatus[]): OrderProductStatus {
  const ongoingStatuses = statuses.filter(
    (status) =>
      status !== ORDER_PRODUCT_STATUS.cancel_request ||
      status !== ORDER_PRODUCT_STATUS.cancel_request,
  );

  if (ongoingStatuses.length === 0) {
    const error = new BusinessLogicError('주문을 취소하는데 문제가 발생했습니다');
    error.setDevMessage('hasCancelRequestStatus와 isFullyCancelled가 선행되어야 합니다');
    throw error;
  }

  const GUARANTEED_UNIQUE_INDEX = 0;
  const uniqueStatuses = [...new Set(ongoingStatuses)];

  if (uniqueStatuses.length > 1) {
    const error = new BusinessLogicError('주문을 취소하는데 문제가 발생했습니다');
    error.setDevMessage('올바르지 않은 주문진행 상태입니다. 상태는 2가지 이상 가질 수 없습니다');
    throw error;
  }

  return uniqueStatuses[GUARANTEED_UNIQUE_INDEX];
}
