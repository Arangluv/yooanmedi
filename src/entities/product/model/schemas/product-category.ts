import { z } from 'zod';

export const productCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
});
export type ProductCategory = z.infer<typeof productCategorySchema>;
