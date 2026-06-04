import { z } from 'zod';
import {
  updateOrderProductRequestSchema,
  bulkUpdateOrderProductRequestSchema,
  createOrderProductSchema,
  orderProductSchema,
} from '../schemas';

export type OrderProductDto = z.infer<typeof orderProductSchema>;
export type UpdateOrderProductRequestDto = z.infer<typeof updateOrderProductRequestSchema>;
export type BulkUpdateOrderProductRequestDto = z.infer<typeof bulkUpdateOrderProductRequestSchema>;
export type CreateOrderProductRequestDto = z.infer<typeof createOrderProductSchema>;
