import { FindOption } from '@/shared';
import { CartItemAdapter } from '../api';
import { CartItemRepository } from '../../core';
import { CreateCartItemDto, UpdateCartItemRequestDto } from '../../dto';
import { CartItemMapper } from '../../mapper';

export class CartItemApiRepository implements CartItemRepository {
  private adapter: ReturnType<typeof CartItemAdapter>;

  constructor(adapter: ReturnType<typeof CartItemAdapter>) {
    this.adapter = adapter;
  }

  async create(dto: CreateCartItemDto) {
    const response = await this.adapter.create(dto);
    if (!response.ok) {
      throw response.error;
    }
    return CartItemMapper.entityToDomin(response.data);
  }

  async findMany(option: FindOption) {
    const response = await this.adapter.getCartItems(option);
    if (!response.ok) {
      throw response.error;
    }
    return CartItemMapper.entitiesToDomainList(response.data);
  }

  async update(dto: UpdateCartItemRequestDto) {
    const response = await this.adapter.updateCartItem(dto);
    if (!response.ok) {
      throw response.error;
    }
    return CartItemMapper.entityToDomin(response.data);
  }

  async delete(id: number) {
    const response = await this.adapter.deleteCartItem(id);
    if (!response.ok) {
      throw response.error;
    }
    return CartItemMapper.entityToDomin(response.data);
  }

  async deleteMany(ids: number[]) {
    const response = await this.adapter.deleteManyCartItem(ids);
    if (!response.ok) {
      throw response.error;
    }
    return CartItemMapper.entitiesToDomainList(response.data);
  }
}
