import type { SearchParams } from 'nuqs';
import { UserRepository } from '@/entities/user/infrastructure';
import { ProductRepository } from '@/entities/product/api/repository';
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
    const productList = await ProductRepository.findMany(
      buildProductsFindOption(queries, searchParams.page),
    );

    const customPriceService = new CustomPriceService();
    const user = await UserRepository.findByHeader();

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
    const productList = await ProductRepository.findMany(buildRankingProductsFindOption());

    const customPriceService = new CustomPriceService();
    const user = await UserRepository.findByHeader();
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
