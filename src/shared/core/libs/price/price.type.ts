import { z } from 'zod';
import { resolvedPriceItemSchema } from './price.schema';

export type ResolvedPriceItem = z.infer<typeof resolvedPriceItemSchema>;
