import { runWithTransaction } from '@/shared/infrastructure';
import { Order, ORDER_STATUS, OrderRepository, UpdateOrderRequestDto } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import { OrderProductRepository } from '@/entities/order-product';
import {
  OrderProductApiRepository,
  OrderProductAdapter,
} from '@/entities/order-product/infrastructure';
import {
  ORDER_PRODUCT_STATUS,
  OrderProduct,
  OrderProductFindOption,
} from '@/entities/order-product';
import { PointCalculator, PointHistoryRepository } from '@/entities/point';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserRepository } from '@/entities/user';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { ITotalCancelCommand } from '../../../core';
import { POINT_ACTION } from '@/entities/point';

export class BankTransferTotalCancelCommand implements ITotalCancelCommand {
  private readonly order: Order;
  private readonly orderRepository: OrderRepository;
  private readonly orderProductRepository: OrderProductRepository;
  private readonly pointHistoryRepository: PointHistoryRepository;
  private readonly userRepository: UserRepository;

  constructor(order: Order) {
    this.order = order;
    this.orderRepository = new OrderApiRepository(OrderAdapter());
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    this.pointHistoryRepository = new PointHistoryApiRepository(PointHistoryAdapter());
    this.userRepository = new UserApiRepository(UserAdapter());
  }

  public async run() {
    const option = OrderProductFindOption.totalCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductRepository.findMany(option);

    // orderProduct update, user point action rollback
    await Promise.all(
      orderProducts.map(async (orderProduct) => {
        await this.updateOrderProductToCancelled(orderProduct.id);
        await this.rollbackEarnPoint(orderProduct);
        await this.rollbackUsePoint(orderProduct);
      }),
    );

    // user point update by created histories
    // todo :: Promise All이 histories를 각각 반환하도록
    // await cancelEarnPointService.updateUserPoint(this.order.user);
    // await cancelUsePointService.updateUserPoint(this.order.user);

    // order update
    await this.updateOrderStatus();
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  private async updateOrderProductToCancelled(orderProductId: number) {
    await this.orderProductRepository.update({
      orderProductId,
      data: {
        orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
      },
    });
  }

  private async updateOrderStatus() {
    const dto = {
      order: this.order.id,
      data: {
        orderStatus: ORDER_STATUS.cancelled,
      },
    } as UpdateOrderRequestDto;
    await this.orderRepository.update(dto);
  }

  private async rollbackEarnPoint(orderProduct: OrderProduct) {
    const canRollback = orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.pending;
    const isAlreayRollback = orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled;

    if (canRollback && !isAlreayRollback) {
      const user = await this.userRepository.findById(this.order.user);
      const history = await this.pointHistoryRepository.createRollbackHistory({
        user: this.order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_earn,
      });
      const updatedPoint = PointCalculator.getUpdatePoint({
        current: user.point,
        delta: PointCalculator.getDeltaPointByHistory(history),
        action: POINT_ACTION.cancel_earn,
      });

      await this.userRepository.update({
        user: this.order.user,
        data: {
          point: updatedPoint,
        },
      });
    }
  }

  private async rollbackUsePoint(orderProduct: OrderProduct) {
    const isAlreayRollback = orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled;

    if (!isAlreayRollback) {
      const user = await this.userRepository.findById(this.order.user);
      const history = await this.pointHistoryRepository.createRollbackHistory({
        user: this.order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_use,
      });
      const updatedPoint = PointCalculator.getUpdatePoint({
        current: user.point,
        delta: PointCalculator.getDeltaPointByHistory(history),
        action: POINT_ACTION.cancel_use,
      });

      await this.userRepository.update({
        user: this.order.user,
        data: {
          point: updatedPoint,
        },
      });
    }
  }
}
