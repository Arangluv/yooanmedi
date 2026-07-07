import { CreateCartDto } from '../dto';
import { Cart, OperatorResultCart } from '../types';

export interface CartRepository {
  create: (dto: CreateCartDto) => Promise<OperatorResultCart>;
  findOneByUserId: (userId: number) => Promise<Cart>;
}
