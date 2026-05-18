import { EndPointResult } from '@/shared';
import { ClientOrderListSearchParams, AdminOrderListSearchParams } from '../lib';
import { AdminOrderListResult, ClientOrderResult } from './schemas';

export interface AdminOrderListUseCase {
  getOrderList: (
    searchParams: AdminOrderListSearchParams,
  ) => Promise<EndPointResult<AdminOrderListResult>>;
}

export interface ClientOrderListUseCase {
  getOrderList: (
    searchParams: ClientOrderListSearchParams,
  ) => Promise<EndPointResult<ClientOrderResult>>;
}
