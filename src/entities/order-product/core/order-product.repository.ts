import { OrderProduct } from '../types';
import { CreateOrderProductRequestDto, UpdateOrderProductRequestDto } from '../dto';
import { FindOption } from '@/shared';

export interface OrderProductRepository {
  create: (dto: CreateOrderProductRequestDto) => Promise<OrderProduct>;
  findById: (id: number) => Promise<OrderProduct>;
  findMany: (option: FindOption) => Promise<OrderProduct[]>;
  updateMany: (dto: UpdateOrderProductRequestDto) => Promise<OrderProduct>; // todo :: 해당 부분 확인 후 수정필요
  update: (dto: UpdateOrderProductRequestDto) => Promise<OrderProduct>; // todo :: 해당 부분 확인 후 수정 필요
}
