import { Order } from '@/entities/order';

export interface TransitionOrderRequestDto {
  order: Order;
}

export interface TransitionOrderListRequestDto {
  orders: Order[];
}

export interface TransitionOrderListResponseDto {
  totalCount: number;
}
