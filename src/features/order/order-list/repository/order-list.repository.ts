import { FindOption } from '@/shared';
import { GetAdminOrderListResponse, GetClientOrderListResponse } from '../model/schemas';

export interface AdminOrderListRepository {
  getOrderList: (option: FindOption) => Promise<GetAdminOrderListResponse>;
}

export interface ClientOrderListRepository {
  getOrderList: (option: FindOption) => Promise<GetClientOrderListResponse>;
}
