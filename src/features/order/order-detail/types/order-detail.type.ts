import { PayloadAdapterResult } from '@/shared';
import { OrderEntity } from '@/entities/order';

export type GetOrderDetailResponse = PayloadAdapterResult<OrderEntity>;
