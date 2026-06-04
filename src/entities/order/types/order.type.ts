import { z } from 'zod';
import { PayloadOrder } from '@/shared';
import { orderSchema } from '../schemas';

export type Order = z.infer<typeof orderSchema>;
export type OrderEntity = PayloadOrder;
