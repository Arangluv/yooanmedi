import { FindOption } from '@/shared';
import { CreateCartItemDto, UpdateCartItemRequestDto } from '../dto';
import { CartItem } from '../types';

export interface CartItemRepository {
  create: (dto: CreateCartItemDto) => Promise<CartItem>;
  findMany: (option: FindOption) => Promise<CartItem[]>;
  update: (dto: UpdateCartItemRequestDto) => Promise<CartItem>;
  delete: (id: number) => Promise<CartItem>;
  deleteMany: (ids: number[]) => Promise<CartItem[]>;
}
