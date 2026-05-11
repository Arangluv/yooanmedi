import { runWithTransaction, TransactionalCommand } from '@/shared/infrastructure';
import { OrderTransitionContext } from './schemas/transition-context.schema';
import { OrderProductFindOption } from '@/entities/order-product';
import { OrderProductService } from '@/entities/order-product/infrastructure';
import { OrderService } from '@/entities/order/model/services/order.service';

export interface IOrderTransitionCommand extends TransactionalCommand<void> {
  execute: () => void;
}

export class OrderTransitionCommand implements IOrderTransitionCommand {
  public readonly context: OrderTransitionContext;

  constructor(context: OrderTransitionContext) {
    this.context = context;
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  public async run() {
    const orderProductService = new OrderProductService();
    const findOption = OrderProductFindOption.orderTransition.build({
      orderId: this.context.order.id,
      currentStatus: this.context.fromOrderProductStatus,
    });
    const orderProducts = await orderProductService.getOrderProducts(findOption);
    await orderProductService.updateOrderProducts(orderProducts, {
      orderProductStatus: this.context.toOrderProductStatus,
    });

    const orderService = new OrderService();
    await orderService.updateOrder(this.context.order, {
      orderStatus: this.context.toOrderStatus,
    });

    if (this.context.afterTransition) {
      await this.context.afterTransition(orderProducts);
    }
  }
}
