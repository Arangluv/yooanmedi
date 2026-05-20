import { FindOption } from '@/shared';
import { GetAdminOrderListResponse, GetClientOrderListResponse } from '../schemas';

export interface AdminOrderListRepository {
  getOrderList: (option: FindOption) => Promise<GetAdminOrderListResponse>;
}

export interface ClientOrderListRepository {
  getOrderList: (option: FindOption) => Promise<GetClientOrderListResponse>;
}
