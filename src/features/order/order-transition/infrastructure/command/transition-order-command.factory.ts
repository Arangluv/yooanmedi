import { Order } from '@/entities/order';
import { OrderService } from '@/entities/order/infrastructure';
import { OrderProductService } from '@/entities/order-product/infrastructure';
import { OrderProduct } from '@/entities/order-product';
import { EarnPointTransaction } from '@/entities/point/model/point-transaction';
import { TransitionOrderCommand } from './transition-order-command';
import { createTransitionOrderContext } from '../../lib/transition-order-context';

export class TransitionOrderCommandFactory {
  public static createCommand(order: Order) {
    const context = createTransitionOrderContext(order);
    const orderService = new OrderService();
    const orderProductService = new OrderProductService();

    if (context.shouldTriggerEarnPointAction) {
      const earnPoint = async (orderProducts: OrderProduct[]) => {
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
      };

      return new TransitionOrderCommand(context, orderService, orderProductService, earnPoint);
    }

    return new TransitionOrderCommand(context, orderService, orderProductService);
  }
}
