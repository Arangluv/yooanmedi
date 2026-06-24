import { PayloadAdapterResult } from '@/shared';
import { CartItemEntity } from './cart-item.type';

export type CreateCartItemResponse = PayloadAdapterResult<CartItemEntity>;
export type GetCartItemsResponse = PayloadAdapterResult<CartItemEntity[]>;
export type DeleteCartItemResponse = PayloadAdapterResult<CartItemEntity>;
export type DeleteManyCartItemResponse = PayloadAdapterResult<CartItemEntity[]>;
export type UpdateCartItemResponse = PayloadAdapterResult<CartItemEntity>;
