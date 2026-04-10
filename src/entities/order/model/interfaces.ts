import type { CreateOrderRequestDto, CreateOrderResponseDto } from './schemas/create-order.schema';

export interface IOrderService {
  createOrder: (dto: CreateOrderRequestDto) => Promise<CreateOrderResponseDto>;
}
