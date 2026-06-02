import { runWithTransaction } from '@/shared/infrastructure';
import { OrderProductRepository, OrderProduct } from '@/entities/order-product';
import { IOrderService } from '@/entities/order';
import { TransitionOrderContext } from '../../schemas';
import { OrderDetailFindOption } from '../../lib';
import { ITransitionOrderCommand } from '../../core';

export class TransitionOrderCommand implements ITransitionOrderCommand {
  public readonly context: TransitionOrderContext;
  private orderProductRepository: OrderProductRepository;
  private orderService: IOrderService;
  private earnPoint?: (orderProduct: OrderProduct[]) => Promise<void>;

  constructor(
    context: TransitionOrderContext,
    orderService: IOrderService,
    orderProductRepository: OrderProductRepository,
    earnPoint?: (orderProduct: OrderProduct[]) => Promise<void>,
  ) {
    this.context = context;
    this.orderService = orderService;
    this.orderProductRepository = orderProductRepository;
    this.earnPoint = earnPoint;
  }

  public async execute() {
    return await runWithTransaction(this);
  }

  public async run() {
    const option = OrderDetailFindOption.getOrderProductListOption(this.context);
    const orderProducts = await this.orderProductRepository.findMany(option);

    await this.orderProductRepository.updateMany({
      orderProductIds: orderProducts.map((item) => item.id),
      data: {
        orderProductStatus: this.context.transitionOrderProductStatus.to,
      },
    });

    await this.orderService.updateOrder(this.context.order, {
      orderStatus: this.context.transitionOrderStatus.to,
    });

    if (this.earnPoint) {
      await this.earnPoint(orderProducts);
    }
  }
}
