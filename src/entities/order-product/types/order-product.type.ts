import { z } from 'zod';
import { orderProductSchema } from '../schemas';
import { PayloadOrderProduct } from '@/shared';

export type OrderProduct = z.infer<typeof orderProductSchema>;
export type OrderProductEntity = Omit<PayloadOrderProduct, 'createdAt' | 'updatedAt'>;
