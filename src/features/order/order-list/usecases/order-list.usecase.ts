import { GetAdminOrderListRequestDto, GetClientOrderListRequestDto } from '../dto';
import { AdminOrderListResult, ClientOrderListResult } from '../types';

export interface OrderListUsecase {
  getAdminOrderList: (dto: GetAdminOrderListRequestDto) => Promise<AdminOrderListResult>;
  getClientOrderList: (dto: GetClientOrderListRequestDto) => Promise<ClientOrderListResult>;
}
