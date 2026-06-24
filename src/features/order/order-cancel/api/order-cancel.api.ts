'use server';

import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../dto';
import { createAdminCancelOrderUseCase, createClientCancelOrderUseCase } from '../infrastructure';
import { CancelOrderCommandResult } from '../core';

export type AdminPartialCancelOrderApiResponse = EndPointResult<CancelOrderCommandResult>;
export const adminPartialCancelOrderApi = async (
  dto: PartialCancelOrderRequestDto,
): Promise<AdminPartialCancelOrderApiResponse> => {
  try {
    const { partialCancel } = await createAdminCancelOrderUseCase();
    const result = await partialCancel(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('부분 결제취소를 처리하는데 문제가 발생했습니다');
  }
};

export type AdminTotalCancelOrderApiResponse = EndPointResult<CancelOrderCommandResult>;
export const adminTotalCancelOrderApi = async (dto: TotalCancelOrderRequestDto) => {
  try {
    const { totalCancel } = await createAdminCancelOrderUseCase();
    const result = await totalCancel(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('부분 결제취소를 처리하는데 문제가 발생했습니다');
  }
};

export type ClientPartialCancelOrderApiResponse = EndPointResult<CancelOrderCommandResult>;
export const clientPartialCancelOrderApi = async (dto: PartialCancelOrderRequestDto) => {
  try {
    const { partialCancel } = await createClientCancelOrderUseCase();
    const result = await partialCancel(dto);
    return EndPointResultManager.okWithData({ data: result });
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('부분 결제취소를 처리하는데 문제가 발생했습니다');
  }
};
