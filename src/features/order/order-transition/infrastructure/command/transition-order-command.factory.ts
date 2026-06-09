import { Order } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import { OrderProduct } from '@/entities/order-product';
import { PointCalculator, PointTransaction } from '@/entities/point';
import { createPointService } from '@/features/point/infrastructure';
import { TransitionOrderCommand } from './transition-order-command';
import { createTransitionOrderContext } from '../../lib/transition-order-context';
import { TransitionOrderMapper } from '../../mapper';
import { POINT_ACTION } from '@/entities/point';

export class TransitionOrderCommandFactory {
  public static createCommand(order: Order) {
    const context = createTransitionOrderContext(order);
    const orderRepository = new OrderApiRepository(OrderAdapter());
    const orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());

    if (context.shouldTriggerEarnPointAction) {
      const earnPoint = async (orderProducts: OrderProduct[]) => {
        const pointService = createPointService();
        const histories = [] as PointTransaction[];
        // 유저 포인트 적립 히스토리 생성
        await Promise.all(
          orderProducts.map(async (orderProduct) => {
            const pointItem = TransitionOrderMapper.orderProductToPointItem(orderProduct);
            const willEarnPoint = PointCalculator.forBank(pointItem);
            const history = await pointService.createUsageHistory({
              user: order.user,
              orderProduct: orderProduct.id,
              type: POINT_ACTION.earn,
              amount: willEarnPoint,
            });
            histories.push(history);
          }),
        );

        // 유저 포인트 업데이트
        await pointService.updateUserPointByHistories({
          user: order.user,
          type: POINT_ACTION.earn,
          histories,
        });
      };

      return new TransitionOrderCommand(
        context,
        orderRepository,
        orderProductRepository,
        earnPoint,
      );
    }

    return new TransitionOrderCommand(context, orderRepository, orderProductRepository);
  }
}
