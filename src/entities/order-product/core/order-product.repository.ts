import { OrderProduct } from '../types';
import { CreateOrderProductRequestDto, UpdateOrderProductRequestDto, BulkUpdateOrderProductRequestDto } from '../dto';
import { FindOption } from '@/shared';

export interface OrderProductRepository {
  create: (dto: CreateOrderProductRequestDto) => Promise<OrderProduct>;
  findById: (id: number) => Promise<OrderProduct>;
  findMany: (option: FindOption) => Promise<OrderProduct[]>;
  update: (dto: UpdateOrderProductRequestDto) => Promise<OrderProduct>;
  updateMany: (dto: BulkUpdateOrderProductRequestDto) => Promise<OrderProduct[]>;
}
