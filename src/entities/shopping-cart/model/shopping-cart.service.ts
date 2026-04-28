import { BusinessLogicError, zodSafeParse } from '@/shared';
import {
  createShoppingCartItemSchema,
  ShoppingCart,
  type CreateShoppingCartItemDto,
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

  public async getShoppingCart(userId: number): Promise<ShoppingCart> {
    try {
      this.validateUserId(userId);
      return await ShoppingCartRepository.findAll(userId);
    } catch (error) {
      throw new BusinessLogicError('장바구니 데이터를 가져오는데 문제가 발생했습니다');
    }
  }

  private validateUserId(userId: number) {
    if (typeof userId !== 'number' || !userId) {
      throw Error('잘못된 유저타입이거나, 비어있습니다');
    }
  }

  // Update
  // Delete
}
