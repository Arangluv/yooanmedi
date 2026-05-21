import { EndPointResult } from '@/shared';
import {
  TransitionOrderRequestDto,
  TransitionOrderListRequestDto,
  TransitionOrderListResponseDto,
} from '../dto';

export interface OrderTransitionUseCase {
  transitionOrder: (dto: TransitionOrderRequestDto) => Promise<EndPointResult>;
  transitionOrderList: (
    dto: TransitionOrderListRequestDto,
  ) => Promise<EndPointResult<TransitionOrderListResponseDto>>;
}
