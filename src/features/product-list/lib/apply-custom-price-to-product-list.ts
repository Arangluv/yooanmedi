import type { Product } from '@/entities/product';
import type { CustomPrice } from '@/entities/custom-price';

/**
 * 제품목록에 사용자 개별설정 가격을 적용하여 반환합니다
 */
export const applyCustomPriceToProducts = ({
  products,
  customPrices,
}: {
  products: Product[];
  customPrices: CustomPrice[];
}) => {
  const customPriceMap = new Map(
    customPrices.map((item: CustomPrice) => [item.product.id, item.price]),
  );

  products.forEach((product) => {
    product.price = customPriceMap.get(product.id) || product.price;
  });

  return products;
};
