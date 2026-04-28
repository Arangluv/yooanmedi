import 'server-only';
import { zodSafeParse } from '@/shared';
import { createCartItem, updateCartItem, deleteCartItem, deleteAllCartItem } from './cart-items';
import { getAllCart } from './carts';
import {
  cartSchema,
  cartItemActionResultSchema,
  type Cart,
  type CreateCartItemEntity,
  type CartItem,
  type CartItemActionResult,
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

  public static async updateItem(cartItem: CartItem): Promise<CartItemActionResult> {
    const result = await updateCartItem(cartItem);
    return zodSafeParse(cartItemActionResultSchema, result);
  }

  public static async deleteItem(cartItemId: number): Promise<CartItemActionResult> {
    const result = await deleteCartItem(cartItemId);
    return zodSafeParse(cartItemActionResultSchema, result);
  }

  // TODO :: 해당부분 payload에서 어떻게 return해주는지 보고 return과 type작성
  public static async deleteAllItem(cartItemIds: number[]) {
    const result = await deleteAllCartItem(cartItemIds);
    return result;
  }
}
