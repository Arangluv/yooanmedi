import { UserRepositoryMocks } from '@/entities/user/__test__';
import { CustomPriceRepositoryMocks } from '@/entities/custom-price/__test__';
import { ProductRepositoryMocks } from '@/entities/product/__test__';
import { ProductListServiceDependencies } from '../../infrastructure/services';

export const ProductListMockDependencies = {
  success: {
    repository: {
      user: UserRepositoryMocks.createSuccess(),
      customPrice: CustomPriceRepositoryMocks.createSuccess(),
      product: ProductRepositoryMocks.createSuccess(),
    },
  } as ProductListServiceDependencies,

  fail: {
    repository: {
      user: UserRepositoryMocks.createError(),
      customPrice: CustomPriceRepositoryMocks.createError(),
      product: ProductRepositoryMocks.createError(),
    },
  } as ProductListServiceDependencies,
};
