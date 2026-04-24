import { Product as ProductEntity } from '@/entities/product';

export interface Product extends Pick<ProductEntity, 'id'> {}
