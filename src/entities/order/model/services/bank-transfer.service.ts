import { IOrderService } from '../interfaces';
import {
  createBankTransferOrderSchema,
  CreateOrderResponseDto,
  type CreateOrderRequestDto,
} from '../schemas/create-order.schema';
import { OrderRepository } from '../../api/repository';
import { zodSafeParse } from '@/shared/lib/zod';

export class BankTransferOrderService implements IOrderService {
  public async createOrder(data: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    const entity = zodSafeParse(createBankTransferOrderSchema, data);
    return await OrderRepository.create(entity);
  }
}
