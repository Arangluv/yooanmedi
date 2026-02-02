import type { Product as PayloadProduct } from '@/payload-types';

export type Product = PayloadProduct;

export type ProductListItem = Pick<
  Product,
  | 'id'
  | 'name'
  | 'price'
  | 'image'
  | 'cashback_rate'
  | 'cashback_rate_for_bank'
  | 'manufacturer'
  | 'specification'
  | 'insurance_code'
  | 'stock'
  | 'delivery_fee'
  | 'returnable'
  | 'is_cost_per_unit'
  | 'is_free_delivery'
>;
