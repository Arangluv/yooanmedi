import { z } from 'zod';
import { type PayloadImage, BaseSchema } from '@/shared';

export const productSchema = z.object({
  id: z.number(),
  image: z.custom<PayloadImage>().nullable(),
  name: z.string(),
  category: z.number().nullable(),
  insurance_code: z.string().nullable(),
  specification: z.string().nullable(),
  manufacturer: z.string(),
  ingredient: z.string().nullable(),
  stock: BaseSchema.number({
    required_message: '재고는 필수입니다',
    invalid_message: '재고는 숫자여야 합니다',
    min: 0,
  }),
  is_best_product: z.boolean(), // todo :: table로 분리해서 관리해야함
  returnable: z.boolean(),
  price: BaseSchema.number({
    required_message: '상품 가격은 필수입니다',
    invalid_message: '상품 가격은 숫자여야 합니다',
    min: 0,
  }),
  cashback_rate: BaseSchema.number({
    required_message: '카드 결제 적립금 비율은 필수입니다',
    invalid_message: '카드 결제 적립금 비율은 숫자여야 합니다',
    min: 0,
    max: 1.8,
  }),
  cashback_rate_for_bank: BaseSchema.number({
    required_message: '무통장 입금 적립금 비율은 필수입니다',
    invalid_message: '무통장 입금 적립금 비율은 숫자여야 합니다',
    min: 0,
    max: 1.8,
  }),
  delivery_fee: BaseSchema.number({
    required_message: '배송비는 필수입니다',
    invalid_message: '배송비는 숫자여야 합니다',
    min: 0,
  }),
  is_cost_per_unit: z.boolean(),
  is_free_delivery: z.boolean(),
  updatedAt: z.string(),
  createdAt: z.string(),
});
export type Product = z.infer<typeof productSchema>;

export const productListSchema = z.array(productSchema);
export type ProductList = z.infer<typeof productListSchema>;
