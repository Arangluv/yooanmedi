import 'server-only';
import { zodSafeParse } from '@/shared';
import { createCartItem } from './create-cart-item';
import { getAllCart } from './get-cart';
import { updateCartItem } from './update-cart-item';
import {
  cartSchema,
  updateCartItemResultSchema,
  type Cart,
  type CreateCartItemEntity,
  type CartItem,
  type UpdateCartItemResult,
} from '../model/cart.schema';

export class CartRepository {
  public static async save(item: CreateCartItemEntity) {
    await createCartItem(item);
  }

  public static async findOne(userId: number): Promise<Cart> {
    const UNIQUE_FIRST_INDEX = 0;
    const result = await getAllCart(userId);
    return zodSafeParse(cartSchema, result[UNIQUE_FIRST_INDEX]);
  }

  public static async updateItem(cartItem: CartItem) {
    const result = await updateCartItem(cartItem);
    return zodSafeParse(updateCartItemResultSchema, result);
  }
}
