import { z } from 'zod';
import { ProductCategory } from './product-category';
import { type PayloadImage, BaseSchema } from '@/shared';

export const productSchema = z.object({
  id: z.number(),
  image: z.custom<PayloadImage>().nullable(),
  name: z.string(),
  category: z.number().nullable().or(z.custom<ProductCategory>()),
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
type ProductBase = z.infer<typeof productSchema>;
export type Product<TCategoty = number | ProductCategory | null> = Omit<ProductBase, 'category'> & {
  category: TCategoty;
};

export const productListSchema = z.array(
  productSchema.extend({
    category: z.custom<ProductCategory>().nullable(),
  }),
);
export type ProductList = Product<ProductCategory | null>[];
