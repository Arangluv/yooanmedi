import { BaseError } from '@/shared';
import { Order } from '@/entities/order';

export class TransitionOrderError extends BaseError {
  static cancelRequestExists() {
    throw new TransitionOrderError({
      clientMsg: '주문 상태를 변경하는데 문제가 발생했습니다 - 주문취소요청 사항이 있습니다',
      errorName: 'TransitionNotSupportError',
    });
  }

  static notSupportOrder(order: Order) {
    throw new TransitionOrderError({
      clientMsg:
        '주문 상태를 변경하는데 문제가 발생했습니다 - 해당 주문에서는 주문상태변경을 지원하지 않습니다',
      devMsg: `해당 주문상태에서는 주문상태 변경을 지원하지 않습니다 - status : ${order.orderStatus}`,
      errorName: 'TransitionNotSupportError',
    });
  }

  static invalidData(order: Order) {
    throw new TransitionOrderError({
      clientMsg: '주문 상태를 변경하는데 문제가 발생했습니다',
      devMsg: `잘못된 주문데이터 입니다 - order : ${order}`,
      errorName: 'InvalidTransitionOrderDataError',
    });
  }
}
