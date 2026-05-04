import { BusinessLogicError, zodSafeParse } from '@/shared';
import { toCreateCartItemEntity, CartItem, cartItemSchema } from './cart.schema';
import type { Cart, CreateCartItemRequestDto, CartItemActionResult } from './cart.schema';
import { UserRepository } from '@/entities/user/infrastructure';
import { CartRepository } from '../api/cart.repository';
import { CartItemRepository } from '../api/cart-items.repository';
import { CustomPrice, CustomPriceRepository } from '@/entities/custom-price';
import { buildCustomPriceFindOption } from '../lib/build-find-option';

export class CartService {
  // TODO :: 오류처리에 대한 경계를 다시한번 생각해볼 필요가 있다.
  public async createCart(userId: number): Promise<void> {
    try {
      this.validateId(userId);
      await CartRepository.create(userId);
    } catch (error) {
      throw new BusinessLogicError('장바구니를 생성하는데 문제가 발생했습니다');
    }
  }

  public async createCartItem(dto: CreateCartItemRequestDto): Promise<CartItem> {
    try {
      const createEntity = toCreateCartItemEntity(dto);
      return await CartItemRepository.save(createEntity);
    } catch (error) {
      throw new BusinessLogicError('장바구니에 상품을 담는데 문제가 발생했습니다');
    }
  }

  public async getCart(): Promise<Cart> {
    try {
      const user = await UserRepository.findByHeader();
      const cartEntity = await CartRepository.findOne(user.id);
      const cartItems = await this.getCartItems(cartEntity.id);

      // 
      // TODO:: 아래 부분 리팩토링 -> 함수가 하는일이 많음
      const customPrices = await CustomPriceRepository.findMany(buildCustomPriceFindOption(user));
      const customPriceMap = new Map(
        customPrices.map((item: CustomPrice) => [item.product.id, item.price]),
      );
      cartItems.forEach((item) => {
        item.product.price = customPriceMap.get(item.product.id) || item.product.price;
      });

      return {
        ...cartEntity,
        items: cartItems,
      };
    } catch (error) {
      throw new BusinessLogicError('장바구니 데이터를 가져오는데 문제가 발생했습니다');
    }
  }

  private async getCartItems(cartId: number): Promise<CartItem[]> {
    try {
      this.validateId(cartId);
      return await CartItemRepository.findAll(cartId);
    } catch (error) {
      throw new BusinessLogicError('장바구니 리스트를 가져오는데 문제가 발생했습니다');
    }
  }

  // 해당 부분 고도화 진행시 추가하기
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

  public async updateCartItem(entity: CartItem): Promise<CartItemActionResult> {
    try {
      return await CartItemRepository.update(entity);
    } catch (error) {
      throw new BusinessLogicError('장바구니 품목을 업데이트 하는데 문제가 발생했습니다');
    }
  }

  public async deleteCartItem(cartItem: CartItem) {
    try {
      this.validateId(cartItem.id);
      return await CartItemRepository.delete(cartItem.id);
    } catch (error) {
      throw new BusinessLogicError('장바구니 품목을 삭제하는데 문제가 발생했습니다');
    }
  }

  public async clearCart() {
    try {
      const cart = await this.getCart();
      const targetCartItems = cart.items.map((item) => item.id);
      return await CartItemRepository.deleteAll(targetCartItems);
    } catch (error) {
      throw new BusinessLogicError('장바구니를 비우는데 문제가 발생했습니다');
    }
  }

  private validateId(id: number) {
    if (typeof id !== 'number' || !id) {
      throw Error('컬렉션 아이디가 비어있거나, 잘못된 타입입니다');
    }
  }
}
