import { runWithTransaction } from '@/shared/infrastructure';
import { OrderProductRepository, OrderProduct } from '@/entities/order-product';
import { OrderRepository, UpdateOrderRequestDto } from '@/entities/order';
import { TransitionOrderContext } from '../../schemas';
import { OrderDetailFindOption } from '../../libs';
import { ITransitionOrderCommand } from '../../core';

export class TransitionOrderCommand implements ITransitionOrderCommand {
  public readonly context: TransitionOrderContext;
  private orderProductRepository: OrderProductRepository;
  private orderRepository: OrderRepository;
  private earnPoint?: (orderProduct: OrderProduct[]) => Promise<void>;

  constructor(
    context: TransitionOrderContext,
    orderRepository: OrderRepository,
    orderProductRepository: OrderProductRepository,
    earnPoint?: (orderProduct: OrderProduct[]) => Promise<void>,
  ) {
    this.context = context;
    this.orderRepository = orderRepository;
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

    const updateDto = {
      order: this.context.order.id,
      data: {
        orderStatus: this.context.transitionOrderProductStatus.to,
      },
    } as UpdateOrderRequestDto;
    await this.orderRepository.update(updateDto);

    if (this.earnPoint) {
      await this.earnPoint(orderProducts);
    }
  }
}
