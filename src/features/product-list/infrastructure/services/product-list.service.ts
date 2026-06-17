import { BaseErrorManager } from '@/shared';
import { ProductRepository } from '@/entities/product';
import { UserRepository } from '@/entities/user';
import { CustomPriceRepository } from '@/entities/custom-price';
import { ProductListUseCase } from '../../usecases';
import { ProductListError, PRODUCT_LIST_ERROR_MESSAGE } from '../../core';
import { GetProductListRequestDto } from '../dto';
import { ProductListFindOption, toProductsWithCustomPrice } from '../libs';

export interface ProductListServiceDependencies {
  repository: {
    product: ProductRepository;
    user: UserRepository;
    customPrice: CustomPriceRepository;
  };
}

export const ProductListService = ({
  repository,
}: ProductListServiceDependencies): ProductListUseCase => ({
  getProductList: async (dto: GetProductListRequestDto) => {
    try {
      const productFindOption = ProductListFindOption.list.default(dto);
      const [productList, user] = await Promise.all([
        repository.product.findMany(productFindOption),
        repository.user.findByHeader(),
      ]);

      const customPriceFindOption = ProductListFindOption.customPrice.findMany(user);
      const customPrices = await repository.customPrice.findMany(customPriceFindOption);
      const productWithCustomPrice = toProductsWithCustomPrice(productList.products, customPrices);

      return { products: productWithCustomPrice, totalCount: productList.totalCount };
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw ProductListError.fetchFail(message ?? PRODUCT_LIST_ERROR_MESSAGE.fetchFail);
    }
  },

  getRankingProductList: async () => {
    try {
      const productFindOption = ProductListFindOption.list.ranking();
      const [productList, user] = await Promise.all([
        repository.product.findMany(productFindOption),
        repository.user.findByHeader(),
      ]);

      const customPriceFindOption = ProductListFindOption.customPrice.findMany(user);
      const customPrices = await repository.customPrice.findMany(customPriceFindOption);

      return { products: toProductsWithCustomPrice(productList.products, customPrices) };
    } catch (error) {
      const message = BaseErrorManager.resolveClientMessage(error);
      throw ProductListError.fetchFail(message ?? PRODUCT_LIST_ERROR_MESSAGE.fetchFail);
    }
  },
});
