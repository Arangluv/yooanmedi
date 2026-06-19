import { OrderEntity } from '@/entities/order';
import { PayloadAdapterPaginatedResult, PayloadAdapterResult } from '@/shared';

export type GetAdminOrderListReponse = PayloadAdapterPaginatedResult<OrderEntity>;
export type GetClientOrderListResponse = PayloadAdapterResult<OrderEntity[]>;
