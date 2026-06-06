import { EndPointResult } from '@/shared';
import { CartItem } from '@/entities/cart-item';
import { CartDetail } from './cart-detail.type';

export type GetCartDetailResponse = EndPointResult<CartDetail>;
export type AddToCartReponse = EndPointResult<CartItem>;
export type SaveCartChangesResponse = EndPointResult<CartItem[]>;
export type DeleteFromCartResponse = EndPointResult<CartItem>;
export type ClearCartResponse = EndPointResult<CartItem[]>;
