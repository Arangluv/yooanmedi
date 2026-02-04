import type { ProductItem as ProductItemEntity } from '../model/types';

export interface ProductItem extends Pick<ProductItemEntity, 'id'> {}
