import { CreateCartDto } from '../dto';
import { Cart } from '../types';

export interface CartRepository {
  create: (dto: CreateCartDto) => Promise<Cart>;
  findOneByUserId: (userId: number) => Promise<Cart>;
}
