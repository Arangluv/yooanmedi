import { CreateCartItemDto, CartItem } from '@/entities/cart-item';
import { CartDetail } from '../types';
import { DeleteCartDetailItemRequestDto, SaveCartDetailRequestDto } from '../dto';

export interface CartUseCase {
  getCart: () => Promise<CartDetail>;
  addToCart: (dto: CreateCartItemDto) => Promise<CartItem>;
  saveCartChanges: (dto: SaveCartDetailRequestDto) => Promise<CartItem[]>;
  deleteFromCart: (dto: DeleteCartDetailItemRequestDto) => Promise<CartItem>;
  clearCart: (cartId: number) => Promise<CartItem[]>;
}
