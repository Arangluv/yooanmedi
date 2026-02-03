import type { Product as PayloadProduct } from '@/payload-types';
import type { KeywordSearchConditionKey } from '../constant/search-keyword-condition';

export type Product = PayloadProduct;

export type SearchParamsType = {
  condition: KeywordSearchConditionKey | null | undefined;
  keyword: string | undefined;
  page: string | undefined;
  category: string | undefined;
};

export type ProductItem = Pick<
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

export type ProductCategory = {
  id: number;
  name: string;
};
