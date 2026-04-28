import { BusinessLogicError, zodSafeParse } from '@/shared';
import { toCreateCartItemEntity, CartItem, cartItemSchema } from './cart.schema';
import type { Cart, CreateCartItemRequestDto, CartItemActionResult } from './cart.schema';
import { CartRepository } from '../api/repository';

export class CartService {
  // TODO :: 오류처리에 대한 경계를 다시한번 생각해볼 필요가 있다.
  public async createCart(userId: number) {
    try {
      this.validateId(userId);
      await CartRepository.create(userId);
    } catch (error) {
      throw new BusinessLogicError('장바구니를 생성하는데 문제가 발생했습니다');
    }
  }

  public async createCartItem(dto: CreateCartItemRequestDto): Promise<void> {
    try {
      const createEntity = toCreateCartItemEntity(dto);
      await CartRepository.saveItem(createEntity);
    } catch (error) {
      throw new BusinessLogicError('장바구니에 상품을 담는데 문제가 발생했습니다');
    }
  }

  public async getCart(cartId: number): Promise<Cart> {
    try {
      this.validateId(cartId);
      return await CartRepository.findOne(cartId);
    } catch (error) {
      throw new BusinessLogicError('장바구니 데이터를 가져오는데 문제가 발생했습니다');
    }
  }

  public async updateCart(dto: CartItem[]): Promise<any> {
    try {
      const cartItems = dto.map((item) => zodSafeParse(cartItemSchema, item));
      const result = await Promise.all(
        cartItems.map((item) => {
          return this.updateCartItem(item);
        }),
      );

      return result;
    } catch (error) {
      throw new BusinessLogicError('장바구니를 업데이트 하는데 문제가 발생했습니다');
    }
  }

  private async updateCartItem(entity: CartItem): Promise<CartItemActionResult> {
    try {
      return await CartRepository.updateItem(entity);
    } catch (error) {
      throw new BusinessLogicError('장바구니 품목을 업데이트 하는데 문제가 발생했습니다');
    }
  }

  public async deleteCartItem(cartItemId: number) {
    try {
      this.validateId(cartItemId);
      return await CartRepository.deleteItem(cartItemId);
    } catch (error) {
      throw new BusinessLogicError('장바구니 품목을 업데이튼 하는데 문제가 발생했습니다');
    }
  }

  public async clearCart(cartId: number) {
    try {
      const cart = await this.getCart(cartId);
      const targetCartItems = cart.items.map((item) => item.id);
      return await CartRepository.deleteAllItem(targetCartItems);
    } catch (error) {
      throw new BusinessLogicError('장바구니 품목을 업데이튼 하는데 문제가 발생했습니다');
    }
  }

  private validateId(id: number) {
    if (typeof id !== 'number' || !id) {
      throw Error('컬렉션 아이디가 비어있거나, 잘못된 타입입니다');
    }
  }
}
