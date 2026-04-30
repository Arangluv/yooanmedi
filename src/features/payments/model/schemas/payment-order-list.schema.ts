import { z } from 'zod';
import { cartItemSchema } from '@/entities/cart/model/cart.schema';

export const populatedOrderListItemSchema = cartItemSchema.omit({
  id: true,
});

export type PopulatedOrderListItem = z.infer<typeof populatedOrderListItemSchema>;

export const populatedOrderListSchema = z
  .array(populatedOrderListItemSchema)
  .min(1, '주문 상품은 비어있을 수 없습니다.');
export type PopulatedOrderList = z.infer<typeof populatedOrderListSchema>;

export const enrichedOrderListItemSchema = populatedOrderListItemSchema.extend({
  totalAmount: z.number().min(0, '총 주문 금액은 음수가 될 수 없습니다.'),
  orderProductDeliveryFee: z.number().min(0, '주문 상품 배송비는 음수가 될 수 없습니다.'),
  calculatedUsedPoint: z.number().min(0, '사용 포인트는 음수가 될 수 없습니다.'),
});
export type EnrichedOrderListItem = z.infer<typeof enrichedOrderListItemSchema>;

export const enrichedOrderListSchema = z
  .array(enrichedOrderListItemSchema)
  .min(1, '주문 상품은 비어있을 수 없습니다.');
export type EnrichedOrderList = z.infer<typeof enrichedOrderListSchema>;
