import { z } from 'zod';
import { productSchema } from '@/entities/product';
import { BaseSchema } from '@/shared';

export const productListSchema = z.object({
  products: z.array(productSchema),
  totalCount: BaseSchema.number({
    min: 0,
  }),
});
export type ProductList = z.infer<typeof productListSchema>;
