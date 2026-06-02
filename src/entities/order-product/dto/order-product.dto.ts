import { z } from 'zod';
import { updateOrderProductRequestSchema, createOrderProductDtoSchema } from '../schemas';

export type UpdateOrderProductRequestDto = z.infer<typeof updateOrderProductRequestSchema>;
export type CreateOrderProductRequestDto = z.infer<typeof createOrderProductDtoSchema>;
