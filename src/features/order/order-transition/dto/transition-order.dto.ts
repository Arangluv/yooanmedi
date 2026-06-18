import { z } from 'zod';
import { Order } from '@/entities/order';
import { TransitionOrderCommandSchema } from '../schemas';

export interface TransitionOrderRequestDto {
  order: Order;
}
export interface TransitionOrderListRequestDto {
  orders: Order[];
}
export interface TransitionOrderListResponseDto {
  totalCount: number;
}

export type PGTransitionOrderCommandDto = z.infer<typeof TransitionOrderCommandSchema.pg>;
export type BankTransferTransitionOrderCommandDto = z.infer<
  typeof TransitionOrderCommandSchema.bank
>;
