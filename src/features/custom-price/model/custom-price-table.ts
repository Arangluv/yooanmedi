import type { Product } from '@/entities/product/model/types';
import type { ProductPrice as PayloadProductPrice } from '@/payload-types';

export type CustomPriceTable = Pick<PayloadProductPrice, 'id' | 'price'> & {
  product: Pick<Product, 'id'>;
};
