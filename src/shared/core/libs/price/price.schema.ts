import { z } from 'zod';
import { BaseSchema } from '../../schemas';

export const priceItemSchema = z.object({
  id: BaseSchema.number({
    required_message: 'priceItem 식별자가 누락되었습니다',
    invalid_message: '잘못된 priceItem 식별자 타입입니다',
  }),
  product: z.object({
    price: BaseSchema.number({ min: 0, required_message: '상품 가격이 누락되었습니다' }),
    delivery_fee: BaseSchema.number({ min: 0, required_message: '배송비가 누락되었습니다' }),
    is_free_delivery: z.boolean(),
    is_cost_per_unit: z.boolean(),
  }),
  quantity: BaseSchema.number({ min: 1, required_message: '수량이 누락되었습니다' }),
});

export const priceItemListSchema = z.array(priceItemSchema);

export const resolvedPriceItemSchema = z.object({
  id: BaseSchema.number({
    required_message: 'priceItem 식별자가 누락되었습니다',
    invalid_message: '잘못된 priceItem 식별자 타입입니다',
  }),
  price: BaseSchema.number({ min: 0, required_message: '상품 가격이 누락되었습니다' }),
  quantity: BaseSchema.number({ min: 1, required_message: '수량이 누락되었습니다' }),
  deliveryFee: BaseSchema.number({ min: 0, required_message: '상품 가격이 누락되었습니다' }),
});
