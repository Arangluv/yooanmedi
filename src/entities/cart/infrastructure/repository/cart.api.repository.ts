import { CartAdapter } from '../api';
import { CartRepository } from '../../core';
import { CreateCartDto } from '../../dto';
import { CartMapper } from '../../mapper';

export class CartApiRepository implements CartRepository {
  private adapter: ReturnType<typeof CartAdapter>;

  constructor(adapter: ReturnType<typeof CartAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreateCartDto) {
    const response = await this.adapter.createCart(dto);
    if (!response.ok) {
      throw response.error;
    }
    return CartMapper.toOperatorResult(response.data);
  }

  async findOneByUserId(userId: number) {
    const response = await this.adapter.getCartByUserId(userId);
    if (!response.ok) {
      throw response.error;
    }
    return CartMapper.entityToDomin(response.data);
  }
}
