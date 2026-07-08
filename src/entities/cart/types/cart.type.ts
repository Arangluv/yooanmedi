import { z } from 'zod';
import { PayloadCart } from '@/shared';
import { cartSchema, operatorResultCartSchema } from '../schemas';

export type CartEntity = PayloadCart;
export type Cart = z.infer<typeof cartSchema>;
export type OperatorResultCart = z.infer<typeof operatorResultCartSchema>;
