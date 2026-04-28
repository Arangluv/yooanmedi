import { z } from 'zod';
import { BaseSchema, zodSafeParse } from '@/shared';
import { productSchema } from '@/entities/product/@x/carts';

export const cartItemBaseSchema = z.object({
  quantity: BaseSchema.number({
    min: 1,
  }),
});

export const cartItemSchema = cartItemBaseSchema.extend({
  id: BaseSchema.collectionId({
    required_message: '장바구니 아이템의 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 장바구니 아이템 타입 입니다',
  }),
  product: productSchema,
});
export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '장바구니 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 장바구니 id 타입입니다',
  }),
  user: BaseSchema.collectionId({
    required_message: '유저 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 유저 id 타입입니다',
  }),
  items: z.array(cartItemSchema),
});
export type Cart = z.infer<typeof cartSchema>;

export const createCartItemRequestSchema = cartItemBaseSchema.extend({
  cartId: BaseSchema.collectionId({
    required_message: '장바구니 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 장바구니 타입입니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '제품 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 제품 타입입니다',
  }),
});
export const createCartItemEntitySchema = createCartItemRequestSchema.extend({
  carts: BaseSchema.collectionId({
    required_message: '장바구니 아이디는 비어있을 수 없습니다',
    invalid_message: '잘못된 장바구니 타입입니다',
  }),
});
export const toCreateCartItemEntity = (dto: CreateCartItemRequestDto) => {
  return zodSafeParse(createCartItemEntitySchema, {
    ...dto,
    carts: dto.cartId,
  });
};
export type CreateCartItemRequestDto = z.infer<typeof createCartItemRequestSchema>;
export type CreateCartItemEntity = z.infer<typeof createCartItemEntitySchema>;

export const cartItemActionResultSchema = z.object({
  id: BaseSchema.collectionId({}),
});
export type CartItemActionResult = z.infer<typeof cartItemActionResultSchema>;
