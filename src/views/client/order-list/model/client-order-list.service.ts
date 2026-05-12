import { ClientPartialOrderCancelCommandFactory } from '@/features/order/cancel-order';
import { type ClientPartialOrderCancelRequestDto } from '../api/order-list.api';
import { toOrder } from './client-order-list.schema';

export class ClientOrderListService {
  public async cancelOrder(dto: ClientPartialOrderCancelRequestDto) {
    const orderEntity = toOrder(dto.order);
    const strategy = ClientPartialOrderCancelCommandFactory.getCancelStrategy(orderEntity);
    const cancelCommand = ClientPartialOrderCancelCommandFactory.createCommand({
      strategy,
      order: orderEntity,
      orderProductId: dto.targetOrderProductId,
    });

    await cancelCommand.execute();
  }
}
