import { PayloadAdapterResult } from '@/shared';
import { OrderEntity } from './order.type';

export type GetOrderResponse = PayloadAdapterResult<OrderEntity>;
export type UpdateOrderResponse = PayloadAdapterResult<OrderEntity>;
export type CreateOrderResponse = PayloadAdapterResult<OrderEntity>;
