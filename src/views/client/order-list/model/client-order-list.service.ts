import { ClientPartialOrderCancelCommandFactory } from '@/features/order/order-cancel';
import { type ClientPartialOrderCancelRequestDto } from '../api/order-list.api';
import { toOrder } from './client-order-list.schema';
import { OrderProductService } from '@/entities/order-product/infrastructure';
import { OrderProductFindOption } from '@/entities/order-product';

export class ClientOrderListService {
  public async cancelOrder(dto: ClientPartialOrderCancelRequestDto) {
    try {
      const orderEntity = toOrder(dto.order);
      const orderProductService = new OrderProductService();
      const option = OrderProductFindOption.clientOrderList.build(orderEntity.id);
      const orderProducts = await orderProductService.getOrderProducts(option);
      const strategy = ClientPartialOrderCancelCommandFactory.getCancelStrategy(
        orderEntity,
        orderProducts,
      );
      const cancelCommand = ClientPartialOrderCancelCommandFactory.createCommand({
        strategy,
        order: orderEntity,
        orderProductId: dto.targetOrderProductId,
      });

      await cancelCommand.execute();
    } catch (error) {
      throw error;
    }
  }
}
