import { runWithTransaction } from '@/shared/infrastructure';
import { IOrderService, Order, ORDER_STATUS } from '@/entities/order';
import { IOrderProductService, OrderProductService } from '@/entities/order-product/infrastructure';
import { OrderService } from '@/entities/order/infrastructure';
import {
  ORDER_PRODUCT_STATUS,
  OrderProduct,
  OrderProductFindOption,
} from '@/entities/order-product';
import {
  CancelEarnPointTransaction,
  CancelUsePointTransaction,
} from '@/entities/point/model/point-transaction';
import { ITotalCancelCommand } from '../../../core';

export class BankTransferTotalCancelCommand implements ITotalCancelCommand {
  private readonly order: Order;
  private readonly orderService: IOrderService;
  private readonly orderProductService: IOrderProductService;

  constructor(order: Order) {
    this.order = order;
    this.orderService = new OrderService();
    this.orderProductService = new OrderProductService();
  }

  public async run() {
    const option = OrderProductFindOption.totalCancelOrder.build(this.order.id);
    const orderProducts = await this.orderProductService.getOrderProductsWithTransaction(option);
    const cancelEarnPointService = new CancelEarnPointTransaction();
    const cancelUsePointService = new CancelUsePointTransaction();

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
}
