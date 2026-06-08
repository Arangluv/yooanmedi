import { z } from 'zod';
import { priceItemDtoSchema } from './price.schema';

export type PriceItemDto = z.infer<typeof priceItemDtoSchema>;
