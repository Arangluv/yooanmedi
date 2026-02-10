import { z } from 'zod';
import moment from 'moment';

import { ORDER_STATUS } from '@/entities/order';

const orderListBaseSchema = z.object({
  from: z.string(),
  to: z.string(),
  pn_keyword: z.string(),
  order_status: z.literal(Object.values(ORDER_STATUS)).nullable(),
});

export const orderListSchema = orderListBaseSchema.transform((data) => ({
  from: moment(data.from).hour(0).minute(0).second(0).toDate(),
  to: moment(data.to).hour(23).minute(59).second(59).toDate(),
  productName: data.pn_keyword,
  orderStatus: data.order_status,
}));

export type OrderListDto = z.infer<typeof orderListSchema>;
