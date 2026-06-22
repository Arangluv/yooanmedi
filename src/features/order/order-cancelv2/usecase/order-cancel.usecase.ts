import { PartialCancelOrderRequestDto, TotalCancelOrderRequestDto } from '../dto';

export interface AdminCancelOrderUseCase {
  partialCancel: (dto: PartialCancelOrderRequestDto) => Promise<any>;
  totalCancel: (dto: TotalCancelOrderRequestDto) => Promise<any>;
}

export interface ClientCancelOrderUseCase {
  partialCancel: (dto: PartialCancelOrderRequestDto) => Promise<any>;
}
