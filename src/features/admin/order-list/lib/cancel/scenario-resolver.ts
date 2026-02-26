import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { CancelOrderActionType } from '../../model/types';
import { CANCEL_SCENARIO } from '../../constants/scenario';

export const cancelScenarioResolver = (currentStatus: CancelOrderActionType) => {
  // 입금 확인중 상태
  if (currentStatus === ORDER_STATUS.PENDING) {
    return CANCEL_SCENARIO.BEFORE_PAYMENT_TO_CANCELLED;
  }

  // 상품준비, 배송시작, 배송완료
  if (
    currentStatus === ORDER_STATUS.PREPARING ||
    currentStatus === ORDER_STATUS.SHIPPING ||
    currentStatus === ORDER_STATUS.DELIVERED
  ) {
    return CANCEL_SCENARIO.PAID_ORDER_TO_CANCELLED;
  }

  // 취소요청 상태
  if (currentStatus === ORDER_STATUS.CANCEL_REQUEST) {
    return CANCEL_SCENARIO.CANCEL_REQUEST_TO_CANCELLED;
  }

  throw new Error('잘못된 주문 상태입니다.');
};
