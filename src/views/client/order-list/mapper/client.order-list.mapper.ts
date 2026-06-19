import { zodSafeParse } from '@/shared';
import { orderSchema } from '@/entities/order';
import { ClientOrderListItem } from '@/features/order/order-list';
import { PartialCancelOrderRequestDto } from '@/features/order/order-cancel';

export class ClientOrderListMapper {
  public static toPartialCancelOrderRequestDto(
    orderDto: ClientOrderListItem,
    orderProductId: number,
  ): PartialCancelOrderRequestDto {
    const order = zodSafeParse(orderSchema, {
      ...orderDto,
      user: orderDto.user.id,
      orderProducts: orderDto.orderProducts.map((item) => item.id),
    });

    return {
      order,
      orderProductId,
    };
  }
}
