import { TransitionOrderRequestDto, TransitionOrderListRequestDto } from '../dto';
import { TransitionOrderCommandResult } from '../core';

export interface OrderTransitionUseCase {
  transitionOrder: (dto: TransitionOrderRequestDto) => Promise<TransitionOrderCommandResult>;
  transitionOrderList: (
    dto: TransitionOrderListRequestDto,
  ) => Promise<TransitionOrderCommandResult>;
}
