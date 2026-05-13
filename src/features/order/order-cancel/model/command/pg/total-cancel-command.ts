import { runWithTransaction } from '@/shared/infrastructure';
import { IOrderService, Order, ORDER_STATUS } from '@/entities/order';
import { IOrderProductService, OrderProductService } from '@/entities/order-product/infrastructure';
import {
  ORDER_PRODUCT_STATUS,
  OrderProduct,
  OrderProductFindOption,
} from '@/entities/order-product';
import { OrderService } from '@/entities/order/infrastructure';
import {
  CancelEarnPointTransaction,
  CancelUsePointTransaction,
} from '@/entities/point/model/point-transaction';
import { EasyPayService, IEasyPay } from '@/entities/easypay';
import { PaymentHistoryService } from '@/entities/payment/infrastructure';
import { ITotalCancelCommand } from '../cancel-command';

type CancelStrategy = 'partial' | 'total';

interface CancelPlan {
  strategy: CancelStrategy;
  amount: number;
}

export class PGTotalCancelCommand implements ITotalCancelCommand {
  private readonly order: Order;
  private readonly orderService: IOrderService;
  private readonly orderProductService: IOrderProductService;
  private readonly easypayService: IEasyPay;

  constructor(order: Order) {
    this.order = order;
    this.orderService = new OrderService();
    this.orderProductService = new OrderProductService();
    this.easypayService = new EasyPayService();
  }

  public async run() {
    const option = OrderProductFindOption.totalCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductService.getOrderProductsWithTransaction(option);
    const cancelEarnPointService = new CancelEarnPointTransaction();
    const cancelUsePointService = new CancelUsePointTransaction();
    const cancelPlan = this.resolveCancelPlan(orderProducts);

    // orderProduct update, user point action rollback
    await Promise.all(
      orderProducts.map(async (orderProduct) => {
        await this.updateOrderProductToCancelled(orderProduct.id);
        await this.rollbackEarnPoint(cancelEarnPointService, orderProduct);
        await this.rollbackUsePoint(cancelUsePointService, orderProduct);
      }),
    );

    // user point update by created histories
    await cancelEarnPointService.updateUserPoint(this.order.user);
    await cancelUsePointService.updateUserPoint(this.order.user);

    // order update
    await this.updateOrderStatus();

    await this.cancelRequestToEasypay(cancelPlan);
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  private async updateOrderProductToCancelled(orderProductId: number) {
    await this.orderProductService.updateOrderProduct(orderProductId, {
      orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
    });
  }

  private async updateOrderStatus() {
    await this.orderService.updateOrder(this.order, { orderStatus: ORDER_STATUS.cancelled });
  }

  private async rollbackEarnPoint(service: CancelEarnPointTransaction, orderProduct: OrderProduct) {
    const canRollback = orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.pending;
    const isAlreayRollback = orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled;

    if (canRollback && !isAlreayRollback) {
      await service.createHistory({
        user: this.order.user,
        orderProduct: orderProduct.id,
      });
    }
  }

  private async rollbackUsePoint(service: CancelUsePointTransaction, orderProduct: OrderProduct) {
    const isAlreayRollback = orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.cancelled;

    if (!isAlreayRollback) {
      await service.createHistory({
        user: this.order.user,
        orderProduct: orderProduct.id,
      });
    }
  }

  private async cancelRequestToEasypay({ strategy, amount }: CancelPlan) {
    const paymentHistoryService = new PaymentHistoryService();
    const { pgCno } = await paymentHistoryService.getPaymentsHistory(this.order.id);

    if (strategy === 'total') {
      await this.easypayService.totalCancelRequest({ amount, pgCno });
    } else {
      await this.easypayService.partialCancelRequest({ amount, pgCno });
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
