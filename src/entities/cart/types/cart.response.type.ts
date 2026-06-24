import { PayloadAdapterResult } from '@/shared';
import { CartEntity } from './cart.type';

export type CreateCartResponse = PayloadAdapterResult<CartEntity>;
export type GetCartResponse = PayloadAdapterResult<CartEntity>;
