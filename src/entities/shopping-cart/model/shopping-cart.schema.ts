import { z } from 'zod';
import { BaseSchema } from '@/shared';

const shoppingCartBaseSchema = z.object({
  user: BaseSchema.collectionId({
    required_message: '유저 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 유저타입 입니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '제품 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 제품 타입 입니다',
  }),
  quantity: BaseSchema.number({
    min: 1,
  }),
});

export const shoppingCartItemSchema = shoppingCartBaseSchema.extend({
  id: BaseSchema.collectionId({
    required_message: '장바구니 아이템의 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 장바구니 아이템 타입 입니다',
  }),
});
export type ShoppingCartItem = z.infer<typeof shoppingCartItemSchema>;

export const shoppingCartSchema = z.array(shoppingCartItemSchema);
export type ShoppingCart = z.infer<typeof shoppingCartSchema>;

export const createShoppingCartItemSchema = shoppingCartBaseSchema;
export type CreateShoppingCartItemDto = z.input<typeof createShoppingCartItemSchema>;
export type CreateShoppingCartItemEntity = z.output<typeof createShoppingCartItemSchema>;
