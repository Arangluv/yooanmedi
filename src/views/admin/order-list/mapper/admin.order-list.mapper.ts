import { z } from 'zod';
import { zodSafeParse } from '@/shared';
import { AdminOrderListItemDto } from '@/features/order/order-list';
import { Order, orderSchema } from '@/entities/order';
import { TotalCancelOrderRequestDto } from '@/features/order/order-cancel';
import { TransitionOrderListRequestDto } from '@/features/order/order-transition';

export class AdminOrderListMapper {
  public static toTotalCancelRequestDto(dto: AdminOrderListItemDto[]): TotalCancelOrderRequestDto {
    const orders: Order[] = dto.map((order) => {
      return {
        ...order,
        user: order.user.id,
        orderProducts: order.orderProducts.map((item) => item.id),
      };
    });

    return {
      orders: zodSafeParse(z.array(orderSchema), orders),
    };
  }

  public static toTransitionOrderListDto(
    dto: AdminOrderListItemDto[],
  ): TransitionOrderListRequestDto {
    const orders: Order[] = dto.map((order) => {
      return {
        ...order,
        user: order.user.id,
        orderProducts: order.orderProducts.map((item) => item.id),
      };
    });

    return {
      orders: zodSafeParse(z.array(orderSchema), orders),
    };
  }
}
