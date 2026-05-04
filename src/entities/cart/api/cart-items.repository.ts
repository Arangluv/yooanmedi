import 'server-only';
import { zodSafeParse } from '@/shared';
import {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteAllCartItem,
  getCartItems,
  getCartItem,
} from './cart-items';
import {
  cartItemActionResultSchema,
  cartItemListSchema,
  type CreateCartItemEntity,
  type CartItem,
  type CartItemActionResult,
  cartItemSchema,
} from '../model/cart.schema';

export class CartItemRepository {
  public static async findAll(cartId: number): Promise<CartItem[]> {
    const result = await getCartItems(cartId);
    return zodSafeParse(cartItemListSchema, result);
  }

  public static async save(entity: CreateCartItemEntity) {
    const result = await createCartItem(entity);
    return zodSafeParse(cartItemSchema, result);
  }

  public static async update(cartItem: CartItem): Promise<CartItemActionResult> {
    const UNIQUE_FIRST_INDEX = 0;
    const result = await updateCartItem(cartItem);
    return zodSafeParse(cartItemActionResultSchema, result[UNIQUE_FIRST_INDEX]);
  }

  public static async delete(id: number): Promise<CartItem> {
    const UNIQUE_FIRST_INDEX = 0;
    const result = await deleteCartItem(id);
    return zodSafeParse(cartItemSchema, result[UNIQUE_FIRST_INDEX]);
  }

  // TODO :: 해당부분 payload에서 어떻게 return해주는지 보고 return과 type작성
  public static async deleteAll(cartItemIds: number[]) {
    const result = await deleteAllCartItem(cartItemIds);
    return result;
  }
}
