import { BusinessLogicError } from '@/shared';
import { Order, ORDER_STATUS, PAYMENT_STATUS, type IOrderService } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, OrderProduct } from '@/entities/order-product';
import { EarnPointTransaction } from '@/entities/point/model/point-transaction';
import { OrderTransitionContext } from './schemas/transition-context.schema';
import { OrderTransitionCommand } from './order-transition-command';

export class OrderTransitionCommandFactory {
  public static createCommand(order: Order) {
    switch (order.orderStatus) {
      case ORDER_STATUS.pending:
        return new OrderTransitionCommand(createContextToPreParing(order));
      case ORDER_STATUS.preparing:
        return new OrderTransitionCommand(createContextToShipping(order));
      case ORDER_STATUS.shipping:
        return new OrderTransitionCommand(createContextToDelivered(order));
      default:
        const error = new BusinessLogicError('주문상태를 변경하는데 문제가 발생했습니다.');
        error.setDevMessage(`올바르지 않은 주문상태입니다 - ${order.orderStatus}`);
        throw error;
    }
  }
}

const createContextToPreParing = (order: Order): OrderTransitionContext => {
  return {
    order,
    fromOrderStatus: ORDER_STATUS.pending,
    toOrderStatus: ORDER_STATUS.preparing,
    fromOrderProductStatus: ORDER_PRODUCT_STATUS.pending,
    toOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
    successMessage: '주문이 상품준비 상태로 변경되었습니다',
    errorMessage: '주문을 상품준비 상태로 변경하는데 문제가 발생했습니다',
    afterTransition: async (orderProducts: OrderProduct[]) => {
      const earnPointTransaction = new EarnPointTransaction();
      let earnedPoint = 0;

      // 유저 포인트 적립 히스토리 생성
      await Promise.all(
        orderProducts.map(async (orderProduct) => {
          // TODO :: ref#1
          const willEarnPoint = Math.floor(
            orderProduct.priceSnapshot * (orderProduct.cashback_rate_for_bank / 100),
          );
          earnedPoint += willEarnPoint;
          await earnPointTransaction.createHistory({
            user: order.user,
            orderProduct: orderProduct.id,
            amount: willEarnPoint,
          });
        }),
      );

      // 유저 포인트 업데이트
      await earnPointTransaction.updateUserPoint(order.user, earnedPoint);
    },
  };
};

const createContextToShipping = (order: Order): OrderTransitionContext => {
  return {
    order,
    fromOrderStatus: ORDER_STATUS.preparing,
    toOrderStatus: ORDER_STATUS.shipping,
    fromOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
    toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
    successMessage: '주문이 배송중 상태로 변경되었습니다',
    errorMessage: '주문을 배송중 상태로 변경하는데 문제가 발생했습니다',
  };
};

const createContextToDelivered = (order: Order): OrderTransitionContext => {
  return {
    order,
    fromOrderStatus: ORDER_STATUS.shipping,
    toOrderStatus: ORDER_STATUS.delivered,
    fromOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
    toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
    successMessage: '주문이 배송완료 상태로 변경되었습니다',
    errorMessage: '주문을 배송완료 상태로 변경하는데 문제가 발생했습니다',
  };
};
