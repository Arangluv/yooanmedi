import { PartialCancelOrderRequestDto } from '@/features/order/order-cancel';
import { OrderDetailDto } from '@/features/order/order-detail';

export class AdminOrderDetailMapper {
  public static toPartialCancelOrderDto(
    orderDto: OrderDetailDto,
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
