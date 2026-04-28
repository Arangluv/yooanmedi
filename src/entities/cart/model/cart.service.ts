import { BusinessLogicError } from '@/shared';
import { toCreateCartItemEntity, type Cart, type CreateCartItemRequestDto } from './cart.schema';
import { CartRepository } from '../api/repository';

export class CartService {
  // TODO :: 오류처리에 대한 경계를 다시한번 생각해볼 필요가 있다.
  public async createCartItem(dto: CreateCartItemRequestDto): Promise<void> {
    try {
      const createEntity = toCreateCartItemEntity(dto);
      await CartRepository.save(createEntity);
    } catch (error) {
      throw new BusinessLogicError('장바구니에 상품을 담는데 문제가 발생했습니다');
    }
  }

  public async getCart(userId: number): Promise<Cart> {
    try {
      this.validateId(userId);
      return await CartRepository.findOne(userId);
    } catch (error) {
      throw new BusinessLogicError('장바구니 데이터를 가져오는데 문제가 발생했습니다');
    }
  }

  private validateId(id: number) {
    if (typeof id !== 'number' || !id) {
      throw Error('컬렉션 아이디가 비어있거나, 잘못된 타입입니다');
    }
  }
}
