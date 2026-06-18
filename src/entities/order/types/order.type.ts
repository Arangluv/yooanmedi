import { z } from 'zod';
import { PayloadOrder } from '@/shared';
import { operatorResultOrderSchema, orderSchema } from '../schemas';

export type OperatorResultOrder = z.infer<typeof operatorResultOrderSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderEntity = PayloadOrder;
