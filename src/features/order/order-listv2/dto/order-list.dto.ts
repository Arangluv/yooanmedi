import { User } from '@/entities/user';
import { AdminOrderListSearchParams, ClientOrderListSearchParams } from '../core';

export type GetAdminOrderListRequestDto = AdminOrderListSearchParams;
export interface GetClientOrderListRequestDto {
  user: User;
  searchParams: ClientOrderListSearchParams;
}
