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
import {
  CustomPriceAdapter,
  CustomPriceApiRepository,
} from '@/entities/custom-price/infrastructure';

export class ProductListService implements IProductListService {
  public async getProductListAppliedCustomPrice(rawSearchParams: Promise<SearchParams>) {
    const searchParams = await ProductListService.getSafeSearchParams(rawSearchParams);
    const queries = generateProductListQueries(searchParams);
    const productApiRepository = new ProductApiRepository(ProductAdapter());
    const { products, totalCount } = await productApiRepository.findMany(
      buildProductsFindOption(queries, searchParams.page),
    );

    const customPriceRepository = new CustomPriceApiRepository(CustomPriceAdapter());
    const userApiRepository = new UserApiRepository(UserAdapter());
    const user = await userApiRepository.findByHeader();
    const customPriceList = await customPriceRepository.findMany(buildCustomPriceFindOption(user));

    // TODO :: 아래 부분 리팩토링
    const map = new Map();
    customPriceList.forEach((item) => {
      map.set(item.product, item.price);
    });

    const appliedProducts = products.map((product) => {
      return {
        ...product,
        price: map.get(product.id) || product.price,
      };
    });

    return { products: appliedProducts, totalCount };
  }

  public async getRankingProductList() {
    const productApiRepository = new ProductApiRepository(ProductAdapter());
    const productList = await productApiRepository.findMany(buildRankingProductsFindOption());

    const customPriceRepository = new CustomPriceApiRepository(CustomPriceAdapter());
    const userApiRepository = new UserApiRepository(UserAdapter());
    const user = await userApiRepository.findByHeader();
    const customPriceList = await customPriceRepository.findMany(buildCustomPriceFindOption(user));

    // 아래 부분 리팩토링
    const map = new Map();
    customPriceList.forEach((item) => {
      map.set(item.product, item.price);
    });
    const appliedProducts = productList.products.map((product) => {
      return {
        ...product,
        price: map.get(product.id) || product.price,
      };
    });

    return appliedProducts;
  }

  public static async getSafeSearchParams(rawSearchParams: Promise<SearchParams>) {
    return await generateSearchParams(rawSearchParams);
  }
}
