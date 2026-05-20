import { PartialCancelOrderRequestDto } from '@/features/order/order-cancel';
import { ClientOrderDto } from '@/features/order/order-list';

export class AdminOrderDetailMapper {
  public static toPartialCancelOrderDto(
    orderDto: ClientOrderDto,
    orderProductId: number,
  ): PartialCancelOrderRequestDto {
    const order = {
      ...orderDto,
      user: orderDto.user.id,
      orderProducts: orderDto.orderProducts.map((item) => item.id),
    };

    return {
      order,
      orderProductId,
    };
  }
}
