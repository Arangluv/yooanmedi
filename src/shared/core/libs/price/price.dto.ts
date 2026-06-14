import { z } from 'zod';
import { priceItemSchema } from './price.schema';

export type PriceItemDto = z.infer<typeof priceItemSchema>;
