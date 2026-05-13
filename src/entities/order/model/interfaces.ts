import type { CreateOrderRequestDto, CreateOrderResponseDto } from './schemas/create-order.schema';

export interface IOrderPaymentsService {
  createOrder: (dto: CreateOrderRequestDto) => Promise<CreateOrderResponseDto>;
}
