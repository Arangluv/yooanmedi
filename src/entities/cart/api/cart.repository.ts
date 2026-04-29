import 'server-only';
import { zodSafeParse } from '@/shared';
import { getCart, createCart } from './carts';
import { cartEntitySchema, CartEntity } from '../model/cart.schema';

export class CartRepository {
  public static async create(userId: number) {
    await createCart(userId);
  }

  public static async findOne(userId: number): Promise<CartEntity> {
    const UNIQUE_FIRST_INDEX = 0;
    const result = await getCart(userId);
    return zodSafeParse(cartEntitySchema, result[UNIQUE_FIRST_INDEX]);
  }
}
