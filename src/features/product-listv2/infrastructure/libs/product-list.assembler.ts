import { CustomPrice, CustomPriceUtil } from '@/entities/custom-price';
import { Product } from '@/entities/product';

export const toProductsWithCustomPrice = (
  products: Product[],
  customPrice: CustomPrice[],
): Product[] => {
  const customPriceMap = CustomPriceUtil.toMapKeyedByProductId(customPrice);
  const productWithCustomPrice = products.map((product) => {
    const price = customPriceMap.get(product.id)?.price || product.price;
    return { ...product, price };
  });

  return productWithCustomPrice;
};
