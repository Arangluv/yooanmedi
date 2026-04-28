import 'server-only';
import { zodSafeParse } from '@/shared';
import { createShoppingCartItem } from './create-shopping-cart';
import { getAllShoppingCart } from './get-shopping-cart';
import {
  shoppingCartSchema,
  type ShoppingCart,
  type CreateShoppingCartItemEntity,
} from '../model/shopping-cart.schema';

export class ShoppingCartRepository {
  public static async save(item: CreateShoppingCartItemEntity) {
    await createShoppingCartItem(item);
  }
  public static async findAll(userId: number): Promise<ShoppingCart> {
    const result = await getAllShoppingCart(userId);
    return zodSafeParse(shoppingCartSchema, result);
  }
}
