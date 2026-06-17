import { GetProductListRequestDto } from '../infrastructure/dto';
import { ProductListResult } from '../types';

export interface ProductListUseCase {
  getProductList: (dto: GetProductListRequestDto) => Promise<ProductListResult>;
  getRankingProductList: () => Promise<Omit<ProductListResult, 'totalCount'>>;
}
