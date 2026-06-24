'use server';

import { BaseErrorManager, EndPointResult, EndPointResultManager, LoggerV2 } from '@/shared';
import { TransitionOrderListRequestDto, TransitionOrderRequestDto } from '../dto';
import { createTransitionOrderService } from '../infrastructure';

export type TransitionOrderApiResponse = EndPointResult;
export const transitionOrderApi = async (dto: TransitionOrderRequestDto) => {
  try {
    const { transitionOrder } = await createTransitionOrderService();
    const result = await transitionOrder(dto);
    return EndPointResultManager.ok(result.message);
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(message ?? '주문상태를 변경하는데 문제가 발생했습니다');
  }
};

export type TransitionOrderListApiResponse = EndPointResult;
export const transitionOrderListApi = async (dto: TransitionOrderListRequestDto) => {
  try {
    const { transitionOrderList } = await createTransitionOrderService();
    const result = await transitionOrderList(dto);
    return EndPointResultManager.ok(result.message);
  } catch (error) {
    LoggerV2.error(error);
    const message = BaseErrorManager.resolveClientMessage(error);
    return EndPointResultManager.fail(
      message ?? '주문리스트 상태를 변경하는데 문제가 발생했습니다',
    );
  }
};
