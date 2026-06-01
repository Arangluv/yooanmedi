import type { SearchParams } from 'nuqs';
import { UserApiRepository, UserAdapter } from '@/entities/user/infrastructure';
import { ProductAdapter, ProductApiRepository } from '@/entities/product/infrastructure';
import { IProductListService } from './interfaces';
import { generateProductListQueries } from '../lib/generate-product-list-queries';
import { generateSearchParams } from '../lib/generate-search-params';
import {
  buildProductsFindOption,
  buildCustomPriceFindOption,
  buildRankingProductsFindOption,
} from '../lib/build-find-options';
import { CustomPriceService } from '@/entities/custom-price/infrastructure';

export class ProductListService implements IProductListService {
  public async getProductListAppliedCustomPrice(rawSearchParams: Promise<SearchParams>) {
    const searchParams = await ProductListService.getSafeSearchParams(rawSearchParams);
    const queries = generateProductListQueries(searchParams);
    const productApiRepository = new ProductApiRepository(ProductAdapter());
    const productList = await productApiRepository.findMany(
      buildProductsFindOption(queries, searchParams.page),
    );

    const customPriceService = new CustomPriceService();
    const userApiRepository = new UserApiRepository(UserAdapter());
    const user = await userApiRepository.findByHeader();

    const customPriceList = await customPriceService.getCustomPrices(
      buildCustomPriceFindOption(user),
    );
    const productsAppliedCustomPrice = customPriceService.applyCustomPriceListToProducts({
      products: productList.products,
      customPrices: customPriceList,
    });
    return { ...productList, products: productsAppliedCustomPrice };
  }

  public async getRankingProductList() {
    const productApiRepository = new ProductApiRepository(ProductAdapter());
    const productList = await productApiRepository.findMany(buildRankingProductsFindOption());

    const customPriceService = new CustomPriceService();
    const userApiRepository = new UserApiRepository(UserAdapter());
    const user = await userApiRepository.findByHeader();
    const customPriceList = await customPriceService.getCustomPrices(
      buildCustomPriceFindOption(user),
    );

    const productsAppliedCustomPrice = customPriceService.applyCustomPriceListToProducts({
      products: productList.products,
      customPrices: customPriceList,
    });

    return productsAppliedCustomPrice;
  }

  public static async getSafeSearchParams(rawSearchParams: Promise<SearchParams>) {
    return await generateSearchParams(rawSearchParams);
  }
}
