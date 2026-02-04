import type { CustomPriceTable } from '../model/custom-price-table';
import type { ProductItem } from '@/entities/product';

/**
 * 커스텀 가격 테이블을 사용하여 제품 가격을 변환합니다.
 * @param productList 제품 리스트
 * @param customPriceTable 커스텀 가격 테이블
 * @returns 변환된 제품 리스트
 */

export const convertToCustomPrice = (
  productList: ProductItem[],
  customPriceTable: CustomPriceTable[],
) => {
  const customPriceMap = new Map(
    customPriceTable.map((item: CustomPriceTable) => [item.product.id, item.price]),
  );

  productList.forEach((product) => {
    product.price = customPriceMap.get(product.id) || product.price;
  });

  return productList;
};
