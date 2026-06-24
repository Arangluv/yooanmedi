import { Order } from '@/entities/order';

export interface PartialCancelOrderRequestDto {
  order: Order;
  orderProductId: number;
}

export interface TotalCancelOrderRequestDto {
  orders: Order[];
}
