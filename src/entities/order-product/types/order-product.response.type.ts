import { PayloadAdapterResult } from '@/shared';
import { OrderProductEntity } from './order-product.type';

export type CreateOrderProductResponse = PayloadAdapterResult<OrderProductEntity>;
export type GetOrderProductResponse = PayloadAdapterResult<OrderProductEntity>;
export type GetOrderProductsResponse = PayloadAdapterResult<OrderProductEntity[]>;
export type BulkUpdateOrderProductResponse = PayloadAdapterResult<OrderProductEntity[]>;
export type UpdateOrderProductResponse = PayloadAdapterResult<OrderProductEntity>;
