import { z } from 'zod';
import { orderDetailSchema } from '../schemas';

export interface GetOrderDetailRequestDto {
  order: number;
}
export type OrderDetailDto = z.infer<typeof orderDetailSchema>;
