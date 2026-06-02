import { z } from 'zod';
import { orderProductSchema } from '../schemas';

export type OrderProduct = z.infer<typeof orderProductSchema>;
