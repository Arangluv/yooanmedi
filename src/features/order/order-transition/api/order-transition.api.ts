'use server';

import { TransitionOrderListRequestDto, TransitionOrderRequestDto } from '../dto';
import { createTransitionOrderService } from '../infrastructure';

export const transitionOrderApi = async (dto: TransitionOrderRequestDto) => {
  const useCases = createTransitionOrderService();
  return await useCases.transitionOrder(dto);
};

export const transitionOrderListApi = async (dto: TransitionOrderListRequestDto) => {
  const useCases = createTransitionOrderService();
  return await useCases.transitionOrderList(dto);
};
