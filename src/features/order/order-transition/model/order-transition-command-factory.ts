import { BusinessLogicError } from '@/shared';
import { Order, ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { OrderTransitionContext } from './schemas/transition-context.schema';
import { OrderTransitionCommand } from './order-transition-command';

export class OrderTransitionCommandFactory {
  public static createCommand(order: Order) {
    switch (order.orderStatus) {
      case ORDER_STATUS.pending:
        return new OrderTransitionCommand(createContextToPreParing());
      case ORDER_STATUS.preparing:
        return new OrderTransitionCommand(createContextToShipping());
      case ORDER_STATUS.shipping:
        return new OrderTransitionCommand(createContextToDelivered());
      default:
        const error = new BusinessLogicError('주문상태를 변경하는데 문제가 발생했습니다.');
        error.setDevMessage(`올바르지 않은 주문상태입니다 - ${order.orderStatus}`);
        throw error;
    }
  }
}

const createContextToPreParing = (): OrderTransitionContext => {
  return {
    fromOrderStatus: ORDER_STATUS.pending,
    toStatus: ORDER_STATUS.preparing,
    fromOrderProductStatus: ORDER_PRODUCT_STATUS.pending,
    toOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
    successMessage: '',
    errorMessage: '',
    afterTransition: () => null,
  };
};

const createContextToShipping = (): OrderTransitionContext => {
  return {
    fromOrderStatus: ORDER_STATUS.preparing,
    toStatus: ORDER_STATUS.shipping,
    fromOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
    toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
    successMessage: '',
    errorMessage: '',
  };
};

const createContextToDelivered = (): OrderTransitionContext => {
  return {
    fromOrderStatus: ORDER_STATUS.shipping,
    toStatus: ORDER_STATUS.delivered,
    fromOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
    toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
    successMessage: '',
    errorMessage: '',
  };
};
