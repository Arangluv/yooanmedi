import 'server-only';
import { getPayload } from '@/shared/infrastructure';
import { CreateCartItemEntity } from '../model/cart.schema';

export const createCartItem = async (entity: CreateCartItemEntity): Promise<void> => {
  const payload = await getPayload();
  await payload.create({
    collection: 'cart-items',
    data: entity,
  });
};
