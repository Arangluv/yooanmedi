import 'server-only';
import { zodSafeParse } from '@/shared';
import { createShoppingCartItem } from './create-shopping-cart';
import {
  shoppingCartItemSchema,
  type CreateShoppingCartItemEntity,
} from '../model/shopping-cart.schema';

export class ShoppingCartRepository {
  public static async save(item: CreateShoppingCartItemEntity) {
    await createShoppingCartItem(item);
  }
}
