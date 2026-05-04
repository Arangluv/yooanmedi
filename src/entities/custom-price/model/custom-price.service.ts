import { BusinessLogicError, type FindOption } from '@/shared';
import type { Product } from '@/entities/product';
import type { CustomPrice } from './schemas/custom-price.schema';
import { CustomPriceRepository } from '../api/repository';

export class CustomPriceService {
  /* v8 ignore next */
  public async getCustomPrices(option: FindOption): Promise<CustomPrice[]> {
    const customPrices = await CustomPriceRepository.findMany(option);
    return customPrices;
  }

  public getCustomPriceMap({
    products,
    customPrices,
  }: {
    products: Product[];
    customPrices: CustomPrice[];
  }) {
    if (products.length === 0) {
      const error = new BusinessLogicError('상품은 비어있을 수 없습니다');
      error.setDevMessage('개별가격 설정 시 상품은 비어있을 수 없습니다.');
      throw error;
    }

    const customPriceMap = new Map<number, number>();

    for (const { product, price } of customPrices) {
      customPriceMap.set(product.id, price);
    }

    return customPriceMap;
  }

  public applyCustomPriceListToProducts(params: {
    products: Product[];
    customPrices: CustomPrice[];
  }) {
    const { products } = params;
    const customPriceMap = this.getCustomPriceMap(params);

    for (const product of products) {
      const customPrice = customPriceMap.get(product.id);
      if (customPrice !== undefined) {
        product.price = customPrice;
      }
    }

    return products;
  }
}
