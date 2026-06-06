import { CreateCartItemDto, CartItem } from '@/entities/cart-item';
import { CartDetail } from '../types';
import { DeleteCartItemToCartRequestDto, SaveCartChangeRequestDto } from '../dto';

export interface CartUseCase {
  getCart: () => Promise<CartDetail>;
  addToCart: (dto: CreateCartItemDto) => Promise<CartItem>;
  saveCartChanges: (dto: SaveCartChangeRequestDto) => Promise<CartItem[]>;
  deleteFromCart: (dto: DeleteCartItemToCartRequestDto) => Promise<CartItem>;
  clearCart: (cartId: number) => Promise<CartItem[]>;
}
