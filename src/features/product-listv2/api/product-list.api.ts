'use server';

import { BaseErrorManager, EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { createProductListUsecase } from '../infrastructure';
import { GetProductListRequestDto } from '../infrastructure/dto';
import { ProductListResult } from '../types';

export type GetProductListApiResponse = EndPointResult<ProductListResult>;
export const getProductListApi = async (dto: GetProductListRequestDto) => {
  try {
    const { getProductList } = createProductListUsecase();
    const data = await getProductList(dto);
    return EndPointResultManager.okWithData({ data });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '상품리스트를 불러오는데 문제가 발생했습니다');
  }
};

export type GetRankingProductListApiResponse = EndPointResult<
  Omit<ProductListResult, 'totalCount'>
>;
export const getRankingProductListApi = async () => {
  try {
    const { getRankingProductList } = createProductListUsecase();
    const data = await getRankingProductList();
    return EndPointResultManager.okWithData({ data });
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '상품리스트를 불러오는데 문제가 발생했습니다');
  }
};
