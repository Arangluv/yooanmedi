import { Order } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import { OrderProductAdapter, OrderProductApiRepository } from '@/entities/order-product/infrastructure';
import { OrderProduct } from '@/entities/order-product';
import { PointCalculator, PointTransaction } from '@/entities/point';
import { PointTransactionServiceFactory } from '@/entities/point/infrastructure';
import { TransitionOrderCommand } from './transition-order-command';
import { createTransitionOrderContext } from '../../lib/transition-order-context';
import { TransitionOrderMapper } from '../../mapper';

export class TransitionOrderCommandFactory {
  public static createCommand(order: Order) {
    const context = createTransitionOrderContext(order);
    const orderRepository = new OrderApiRepository(OrderAdapter());
    const orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());

    if (context.shouldTriggerEarnPointAction) {
      const earnPoint = async (orderProducts: OrderProduct[]) => {
        const earnPointTransactionService = PointTransactionServiceFactory.forEarn();
        const histories = [] as PointTransaction[];
        // 유저 포인트 적립 히스토리 생성
        await Promise.all(
          orderProducts.map(async (orderProduct) => {
            const pointItem = TransitionOrderMapper.orderProductToPointItem(orderProduct);
            const willEarnPoint = PointCalculator.forBank(pointItem);
            const history = await earnPointTransactionService.createHistory({
              user: order.user,
              orderProduct: orderProduct.id,
              amount: willEarnPoint,
            });
            histories.push(history);
          }),
        );

        // 유저 포인트 업데이트
        await earnPointTransactionService.updateUserPointFromHistories(order.user, histories);
      };

      return new TransitionOrderCommand(context, orderRepository, orderProductRepository, earnPoint);
    }

    return new TransitionOrderCommand(context, orderRepository, orderProductRepository);
  }
}
