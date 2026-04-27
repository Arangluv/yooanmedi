import { z } from 'zod';
import { productSchema } from '@/entities/product/model/schemas/product.schema';
import { BaseSchema } from '@/shared';

export const inventoryItemSchema = z.object({
  product: productSchema,
  quantity: BaseSchema.number({
    required_message: '주문 수량은 비어있을 수 없습니다.',
    invalid_message: '주문 수량은 숫자여야 합니다.',
    min: 1,
  }),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const inventorySchema = z.array(inventoryItemSchema);
export type Inventory = z.infer<typeof inventorySchema>;
