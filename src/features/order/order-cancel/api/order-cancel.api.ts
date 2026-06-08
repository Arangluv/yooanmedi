'use server';

import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../dto';
import { createAdminCancelOrderUseCase, createClientCancelOrderUseCase } from '../infrastructure';

export const adminCancelPartialOrderApi = async (dto: PartialCancelOrderRequestDto) => {
  const useCases = createAdminCancelOrderUseCase();
  return await useCases.partialCancel(dto);
};

export const adminCancelTotalOrderApi = async (dto: TotalCancelOrderRequestDto) => {
  const useCases = createAdminCancelOrderUseCase();
  return await useCases.totalCancel(dto);
};

export const clientCancelPartialOrderApi = async (dto: PartialCancelOrderRequestDto) => {
  const useCases = createClientCancelOrderUseCase();
  return await useCases.partialCancel(dto);
};
