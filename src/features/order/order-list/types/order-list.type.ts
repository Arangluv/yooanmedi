import { z } from 'zod';
import {
  adminOrderListResultSchema,
  clientOrderListResultSchema,
  adminOrderListItemSchema,
  clientOrderListItemSchema,
} from '../schemas';

export type AdminOrderListResult = z.infer<typeof adminOrderListResultSchema>;
export type ClientOrderListResult = z.infer<typeof clientOrderListResultSchema>;
export type AdminOrderListItem = z.infer<typeof adminOrderListItemSchema>;
export type ClientOrderListItem = z.infer<typeof clientOrderListItemSchema>;
