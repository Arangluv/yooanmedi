import { Order } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import { OrderProduct } from '@/entities/order-product';
import { PointCalculator, PointHistory } from '@/entities/point';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { TransitionOrderCommand } from './transition-order-command';
import { createTransitionOrderContext } from '../../lib/transition-order-context';
import { TransitionOrderMapper } from '../../mapper';
import { POINT_ACTION } from '@/entities/point';

export class TransitionOrderCommandFactory {
  public static createCommand(order: Order) {
    const context = createTransitionOrderContext(order);
    const orderRepository = new OrderApiRepository(OrderAdapter());
    const orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    const pointHistoryRepository = new PointHistoryApiRepository(PointHistoryAdapter());
    const userRepository = new UserApiRepository(UserAdapter());

    if (context.shouldTriggerEarnPointAction) {
      const earnPoint = async (orderProducts: OrderProduct[]) => {
        const histories = [] as PointHistory[];
        // 유저 포인트 적립 히스토리 생성
        await Promise.all(
          orderProducts.map(async (orderProduct) => {
            const pointItem = TransitionOrderMapper.orderProductToPointItem(orderProduct);
            const willEarnPoint = PointCalculator.forBank(pointItem);
            const history = await pointHistoryRepository.createUsageHistory({
              user: order.user,
              orderProduct: orderProduct.id,
              type: POINT_ACTION.earn,
              amount: willEarnPoint,
            });
            histories.push(history);
          }),
        );

        // 유저 포인트 업데이트
        const user = await userRepository.findById(order.user);
        const updatedPoint = PointCalculator.getUpdatePoint({
          current: user.point,
          delta: PointCalculator.getDeltaPointByHistories(histories),
          action: POINT_ACTION.cancel_earn,
        });

        await userRepository.update({
          user: order.user,
          data: {
            point: updatedPoint,
          },
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
