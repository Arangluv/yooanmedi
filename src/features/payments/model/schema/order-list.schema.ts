import { z } from 'zod';
import { baseSchema } from './base.schema';
import type { Image } from '@/payload-types';

// todo :: product schema는 product entity layer에서 가져오도록 수정
export const hydratedOrderListItemSchema = z.object({
  product: z.object({
    id: z.number(),
    price: z.number(),
    image: z.number().nullable().or(z.custom<Image>()),
    name: z.string(),
    insurance_code: z.string().nullable(),
    specification: z.string().nullable(),
    manufacturer: z.string(),
    ingredient: z.string().nullable(),
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
export type HydratedOrderListItem = z.infer<typeof hydratedOrderListItemSchema>;

export const hydratedOrderListSchema = z
  .array(hydratedOrderListItemSchema)
  .min(1, '주문 상품은 비어있을 수 없습니다.');
export type HydratedOrderList = z.infer<typeof hydratedOrderListSchema>;

export const enrichedOrderListItemSchema = hydratedOrderListItemSchema.extend({
  totalAmount: z.number().min(0, '총 주문 금액은 음수가 될 수 없습니다.'),
  orderProductDeliveryFee: z.number().min(0, '주문 상품 배송비는 음수가 될 수 없습니다.'),
  calculatedUsedPoint: z.number().min(0, '사용 포인트는 음수가 될 수 없습니다.'),
});
export type EnrichedOrderListItem = z.infer<typeof enrichedOrderListItemSchema>;

export const enrichedOrderListSchema = z
  .array(enrichedOrderListItemSchema)
  .min(1, '주문 상품은 비어있을 수 없습니다.');
export type EnrichedOrderList = z.infer<typeof enrichedOrderListSchema>;
