import { BusinessLogicError, normalizeError, zodSafeParse } from '@/shared';
import {
  createShoppingCartItemSchema,
  type CreateShoppingCartItemDto,
  type ShoppingCartItem,
} from './shopping-cart.schema';
import { ShoppingCartRepository } from '../api/repository';

export class ShoppingCartService {
  // TODO :: 오류처리에 대한 경계를 다시한번 생각해볼 필요가 있다.
  public async createShoppingCartItem(dto: CreateShoppingCartItemDto): Promise<void> {
    try {
      const item = zodSafeParse(createShoppingCartItemSchema, dto);
      await ShoppingCartRepository.save(item);
    } catch (error) {
      throw new BusinessLogicError('장바구니에 상품을 담는데 문제가 발생했습니다');
    }
  }

  // Read
  // Update
  // Delete
}
