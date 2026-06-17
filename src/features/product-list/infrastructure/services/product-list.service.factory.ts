import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import {
  CustomPriceAdapter,
  CustomPriceApiRepository,
} from '@/entities/custom-price/infrastructure';
import { ProductAdapter, ProductApiRepository } from '@/entities/product/infrastructure';
import { ProductListService, ProductListServiceDependencies } from './product-list.service';

export const createProductListUsecase = () => {
  const userRepository = new UserApiRepository(UserAdapter());
  const customPriceRepository = new CustomPriceApiRepository(CustomPriceAdapter());
  const productRepository = new ProductApiRepository(ProductAdapter());

  const dependencies: ProductListServiceDependencies = {
    repository: {
      user: userRepository,
      customPrice: customPriceRepository,
      product: productRepository,
    },
  };

  return ProductListService(dependencies);
};
