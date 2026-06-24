import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../dto';
import { CancelOrderCommandResult } from '../core';

export interface AdminCancelOrderUseCase {
  partialCancel: (dto: PartialCancelOrderRequestDto) => Promise<CancelOrderCommandResult>;
  totalCancel: (dto: TotalCancelOrderRequestDto) => Promise<CancelOrderCommandResult>;
}

export interface ClientCancelOrderUseCase {
  partialCancel: (dto: PartialCancelOrderRequestDto) => Promise<CancelOrderCommandResult>;
}
