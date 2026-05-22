import { BusinessLogicError } from '@/shared';
import { Order, ORDER_STATUS } from '@/entities/order';
import { TransitionKey } from '../constants';

export class TransitionOrderResolver {
  public static getTransitionKeyByCurrentOrderStatus(order: Order): TransitionKey {
    switch (order.orderStatus) {
      case ORDER_STATUS.pending:
        return ORDER_STATUS.preparing;
      case ORDER_STATUS.preparing:
        return ORDER_STATUS.shipping;
      case ORDER_STATUS.shipping:
        return ORDER_STATUS.delivered;
    }

    const error = new BusinessLogicError('주문 상태를 변경하는데 문제가 발생했습니다');
    error.setDevMessage('해당 주문상태를 변경할 수 없는 주문입니다');
    throw error;
  }
}
