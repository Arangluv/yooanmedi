'use server';

import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { GetAdminOrderListRequestDto, GetClientOrderListRequestDto } from '../dto';
import { createOrderListUsecase } from '../infrastructure';
import { AdminOrderListResult, ClientOrderListResult } from '../types';

export type GetAdminOrderListApiResponse = EndPointResult<AdminOrderListResult>;
export const getAdminOrderListApi = async (dto: GetAdminOrderListRequestDto) => {
  try {
    const { getAdminOrderList } = createOrderListUsecase();
    const result = await getAdminOrderList(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('주문리스트를 불러오는데 문제가 발생했습니다');
  }
};

export type GetClientOrderListApiResponse = EndPointResult<ClientOrderListResult>;
export const getClientOrderListApi = async (dto: GetClientOrderListRequestDto) => {
  try {
    const { getClientOrderList } = createOrderListUsecase();
    const result = await getClientOrderList(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('주문리스트를 불러오는데 문제가 발생했습니다');
  }
};
