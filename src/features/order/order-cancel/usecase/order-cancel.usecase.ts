import { EndPointResult } from '@/shared';
import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../dto';

export interface AdminCancelOrderUseCase {
  partialCancel: (dto: PartialCancelOrderRequestDto) => Promise<EndPointResult>;
  totalCancel: (dto: TotalCancelOrderRequestDto) => Promise<EndPointResult>;
}

export interface ClientCancelOrderUseCase {
  partialCancel: (dto: PartialCancelOrderRequestDto) => Promise<EndPointResult>;
}
