import { z } from 'zod';
import type { Image } from '@/payload-types';

export const inventoryItemSchema = z.object({
  product: z.object({
    id: z.number(),
    price: z.number(),
    image: z.number().nullable().or(z.custom<Image>()),
    name: z.string(),
    insurance_code: z.string(),
    specification: z.string(),
    manufacturer: z.string(),
    ingredient: z.string(),
    stock: z.number(),
    is_best_product: z.boolean().nullable().optional(),
    returnable: z.boolean(),
    cashback_rate: z.number(),
    cashback_rate_for_bank: z.number(),
    delivery_fee: z.number(),
    is_cost_per_unit: z.boolean(),
    is_free_delivery: z.boolean(),
    updatedAt: z.string(),
    createdAt: z.string(),
  }),
  quantity: z.number(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const inventorySchema = z.array(inventoryItemSchema);
export type Inventory = z.infer<typeof inventorySchema>;
