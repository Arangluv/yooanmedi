import 'server-only';
import { getPayload } from '@/shared/infrastructure';
import { CreateShoppingCartItemEntity } from '../model/shopping-cart.schema';

export const createShoppingCartItem = async (
  entity: CreateShoppingCartItemEntity,
): Promise<void> => {
  const payload = await getPayload();
  await payload.create({
    collection: 'shopping-cart',
    data: entity,
  });
};
