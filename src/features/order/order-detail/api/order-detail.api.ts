'use server';

import { EndPointResultManager, EndPointResult, LoggerV2 } from '@/shared';
import { GetOrderDetailRequestDto, OrderDetailDto } from '../dto';
import { createOrderDetailUsecase } from '../infrastructure';

export type GetOrderDetailApiResponse = EndPointResult<OrderDetailDto>;

export const getOrderDetailApi = async (
  dto: GetOrderDetailRequestDto,
): Promise<GetOrderDetailApiResponse> => {
  try {
    const { getOrderDetail } = createOrderDetailUsecase();
    const orderDetail = await getOrderDetail(dto);
    return EndPointResultManager.okWithData({
      data: orderDetail,
    });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('주문 상세내역을 불러오는데 문제가 발생했습니다');
  }
};
