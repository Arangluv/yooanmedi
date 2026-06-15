import { z } from 'zod';
import { PayloadOrder } from '@/shared';
import { createdOrderSchema, orderSchema } from '../schemas';

export type CreatedOrder = z.infer<typeof createdOrderSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderEntity = PayloadOrder;
