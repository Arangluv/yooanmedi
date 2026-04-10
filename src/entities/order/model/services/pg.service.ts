import { IOrderService } from '../interfaces';
import {
  CreateOrderResponseDto,
  createPGOrderSchema,
  type CreateOrderRequestDto,
} from '../schemas/create-order.schema';
import { OrderRepository } from '../repository';
import { zodSafeParse } from '@/shared/lib/zod';

export class PGOrderService implements IOrderService {
  public async createOrder(data: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    const entity = zodSafeParse(createPGOrderSchema, data);
    return await OrderRepository.create(entity);
  }
}
