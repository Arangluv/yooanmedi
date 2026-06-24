'use server';

import { EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../dto';
import { createAdminCancelOrderUseCase, createClientCancelOrderUseCase } from '../infrastructure';

export type CancelOrderApiResponse = EndPointResult;

export const adminPartialCancelOrderApi = async (
  dto: PartialCancelOrderRequestDto,
): Promise<CancelOrderApiResponse> => {
  try {
    const { partialCancel } = await createAdminCancelOrderUseCase();
    const { message } = await partialCancel(dto);
    return EndPointResultManager.ok(message);
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('부분 결제취소를 처리하는데 문제가 발생했습니다');
  }
};

export const adminTotalCancelOrderApi = async (
  dto: TotalCancelOrderRequestDto,
): Promise<CancelOrderApiResponse> => {
  try {
    const { totalCancel } = await createAdminCancelOrderUseCase();
    const { message } = await totalCancel(dto);
    return EndPointResultManager.ok(message);
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('부분 결제취소를 처리하는데 문제가 발생했습니다');
  }
};

export const clientPartialCancelOrderApi = async (
  dto: PartialCancelOrderRequestDto,
): Promise<CancelOrderApiResponse> => {
  try {
    const { partialCancel } = await createClientCancelOrderUseCase();
    const { message } = await partialCancel(dto);
    return EndPointResultManager.ok(message);
  } catch (error) {
    LoggerV2.error(error);
    return EndPointResultManager.fail('부분 결제취소를 처리하는데 문제가 발생했습니다');
  }
};
