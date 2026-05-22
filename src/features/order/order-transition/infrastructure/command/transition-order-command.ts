import { runWithTransaction } from '@/shared/infrastructure';
import { IOrderProductService, OrderProduct } from '@/entities/order-product';
import { IOrderService } from '@/entities/order';
import { TransitionOrderContext } from '../../schemas';
import { OrderDetailFindOption } from '../../lib';
import { ITransitionOrderCommand } from '../../core';

export class TransitionOrderCommand implements ITransitionOrderCommand {
  public readonly context: TransitionOrderContext;
  private orderProductService: IOrderProductService;
  private orderService: IOrderService;
  private earnPoint?: (orderProduct: OrderProduct[]) => Promise<void>;

  constructor(
    context: TransitionOrderContext,
    orderService: IOrderService,
    orderProductService: IOrderProductService,
    earnPoint?: (orderProduct: OrderProduct[]) => Promise<void>,
  ) {
    this.context = context;
    this.orderService = orderService;
    this.orderProductService = orderProductService;
    this.earnPoint = earnPoint;
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  public async run() {
    const findOption = OrderDetailFindOption.getOrderProductListOption(this.context);
    const orderProducts = await this.orderProductService.getOrderProducts(findOption);

    await this.orderProductService.updateOrderProducts(orderProducts, {
      orderProductStatus: this.context.transitionOrderProductStatus.to,
    });

    await this.orderService.updateOrder(this.context.order, {
      orderStatus: this.context.transitionOrderStatus.to,
    });

    if (this.earnPoint) {
      await this.earnPoint(orderProducts);
    }
  }
}
