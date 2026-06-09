import { runWithTransaction } from '@/shared/infrastructure';
import { Order, ORDER_STATUS, OrderRepository, UpdateOrderRequestDto } from '@/entities/order';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import { OrderProductRepository } from '@/entities/order-product';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import {
  ORDER_PRODUCT_STATUS,
  OrderProduct,
  OrderProductFindOption,
} from '@/entities/order-product';
import { createPointService } from '@/features/point/infrastructure';
import { EasyPayService, IEasyPay } from '@/entities/easypay';
import {
  PaymentHistoryAdapter,
  PaymentHistoryApiRepository,
} from '@/entities/payment/infrastructure';
import { ITotalCancelCommand } from '../../../core';
import { PointUsecase } from '@/features/point';
import { POINT_ACTION } from '@/entities/point';

type CancelStrategy = 'partial' | 'total';

interface CancelPlan {
  strategy: CancelStrategy;
  amount: number;
}

export class PGTotalCancelCommand implements ITotalCancelCommand {
  private readonly order: Order;
  private readonly orderRepository: OrderRepository;
  private readonly orderProductRepository: OrderProductRepository;
  private readonly easypayService: IEasyPay;

  constructor(order: Order) {
    this.order = order;
    this.orderRepository = new OrderApiRepository(OrderAdapter());
    this.orderProductRepository = new OrderProductApiRepository(OrderProductAdapter());
    this.easypayService = new EasyPayService();
  }

  public async run() {
    const option = OrderProductFindOption.totalCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductRepository.findMany(option);
    const pointService = createPointService();
    const cancelPlan = this.resolveCancelPlan(orderProducts);

    // orderProduct update, user point action rollback
    await Promise.all(
      orderProducts.map(async (orderProduct) => {
        await this.updateOrderProductToCancelled(orderProduct.id);
        await this.rollbackEarnPoint(pointService, orderProduct);
        await this.rollbackUsePoint(pointService, orderProduct);
      }),
    );

    // user point update by created histories
    // todo :: promise.all이 histories를 반환하도록 refactor
    // await cancelEarnPointService.updateUserPoint(this.order.user);
    // await cancelUsePointService.updateUserPoint(this.order.user);

    // order update
    await this.updateOrderStatus();

    await this.cancelRequestToEasypay(cancelPlan);
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

  private async rollbackEarnPoint(service: PointUsecase, orderProduct: OrderProduct) {
    const canRollback = orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.pending;
    const isAlreayRollback = orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled;

    if (canRollback && !isAlreayRollback) {
      const history = await service.createRefundHistory({
        user: this.order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_earn,
        rollbackType: POINT_ACTION.use,
      });
      await service.updateUserPointByHistories({
        user: this.order.user,
        histories: [history],
        type: POINT_ACTION.cancel_earn,
      });
    }
  }

  private async rollbackUsePoint(service: PointUsecase, orderProduct: OrderProduct) {
    const isAlreayRollback = orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled;

    if (!isAlreayRollback) {
      const history = await service.createRefundHistory({
        user: this.order.user,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.cancel_earn,
        rollbackType: POINT_ACTION.use,
      });
      await service.updateUserPointByHistories({
        user: this.order.user,
        histories: [history],
        type: POINT_ACTION.cancel_earn,
      });
    }
  }

  private async cancelRequestToEasypay({ strategy, amount }: CancelPlan) {
    const paymentHistoryRepository = new PaymentHistoryApiRepository(PaymentHistoryAdapter());
    const paymentHistory = await paymentHistoryRepository.findByOrderId(this.order.id);

    if (strategy === 'total') {
      await this.easypayService.totalCancelRequest({ amount, pgCno: paymentHistory.pgCno });
    } else {
      await this.easypayService.partialCancelRequest({ amount, pgCno: paymentHistory.pgCno });
    }
  }

  private resolveCancelPlan(orderProducts: OrderProduct[]): CancelPlan {
    const isExistAlreadyCancelledItem = orderProducts.some(
      (orderProduct) => orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled,
    );

    let cancelAmount = 0;
    orderProducts.forEach((orderProduct) => {
      if (orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancelled) {
        cancelAmount += orderProduct.totalAmount;
      }
    });

    if (isExistAlreadyCancelledItem) {
      return { strategy: 'partial', amount: cancelAmount };
    } else {
      return { strategy: 'total', amount: cancelAmount };
    }
  }
}
