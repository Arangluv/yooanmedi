import 'server-only';
import { zodSafeParse } from '@/shared';
import { createCartItem } from './create-shopping-cart';
import { getAllCart } from './get-shopping-cart';
import { cartSchema, type Cart, type CreateCartItemEntity } from '../model/cart.schema';

export class CartRepository {
  public static async save(item: CreateCartItemEntity) {
    await createCartItem(item);
  }

  public static async findOne(userId: number): Promise<Cart> {
    const UNIQUE_FIRST_INDEX = 0;
    const result = await getAllCart(userId);
    return zodSafeParse(cartSchema, result[UNIQUE_FIRST_INDEX]);
  }

  public static async updateBulk() {}
}
