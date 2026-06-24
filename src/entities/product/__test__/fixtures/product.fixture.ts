import { PaginatedDocs } from 'payload';
import { Product, ProductEntity, ProductCategory, ProductCategoryEntity } from '../../types';

export const ProductFixtures = {
  noImage: {
    id: 1685,
    image: null,
    name: '둘코락스좌약',
    insurance_code: '',
    specification: '10mg/50T',
    manufacturer: '오펠라헬스케어코리아주식회사',
    ingredient: 'ginkgo biloba leaf ext. 17.5mg',
    stock: 999,
    is_best_product: true,
    returnable: false,
    price: 9650,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
  } as Product,

  withImage: {
    id: 1680,
    image: {
      id: 196,
      updatedAt: '2026-01-07T05:33:20.983Z',
      createdAt: '2026-01-07T05:33:20.507Z',
      url: '/api/image/file/-1ml-50a-1767764000584.webp',
      thumbnailURL: null,
      filename: '-1ml-50a-1767764000584.webp',
      mimeType: 'image/webp',
      filesize: 34136,
      width: 249,
      height: 335,
      focalX: 50,
      focalY: 50,
    },
    name: '칼트레이트디400',
    insurance_code: '051600350',
    specification: '30정',
    manufacturer: '헤일리온코리아 주식회사',
    ingredient: 'dexpanthenol 500mg',
    stock: 999,
    is_best_product: true,
    returnable: false,
    price: 2430,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
  } as Product,
};

export const createProductFixture = (override?: Partial<Product>) => {
  return {
    ...ProductFixtures.withImage,
    ...override,
  };
};

export const ProductEntityFixtures = {
  noImage: {
    id: 1685,
    image: null,
    name: '둘코락스좌약',
    insurance_code: '',
    specification: '10mg/50T',
    manufacturer: '오펠라헬스케어코리아주식회사',
    ingredient: 'ginkgo biloba leaf ext. 17.5mg',
    stock: 999,
    is_best_product: true,
    returnable: false,
    price: 9650,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
  } as ProductEntity,

  withImage: {
    id: 1680,
    image: {
      id: 196,
      updatedAt: '2026-01-07T05:33:20.983Z',
      createdAt: '2026-01-07T05:33:20.507Z',
      url: '/api/image/file/-1ml-50a-1767764000584.webp',
      thumbnailURL: null,
      filename: '-1ml-50a-1767764000584.webp',
      mimeType: 'image/webp',
      filesize: 34136,
      width: 249,
      height: 335,
      focalX: 50,
      focalY: 50,
    },
    name: '칼트레이트디400',
    insurance_code: '051600350',
    specification: '30정',
    manufacturer: '헤일리온코리아 주식회사',
    ingredient: 'dexpanthenol 500mg',
    stock: 999,
    is_best_product: true,
    returnable: false,
    price: 2430,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
  } as ProductEntity,
};

export const createProductEntityFixture = (override?: Partial<ProductEntity>) => {
  return {
    ...ProductEntityFixtures.withImage,
    ...override,
  };
};

export const baseProductListFixture = {
  docs: [ProductEntityFixtures.noImage, ProductEntityFixtures.withImage] as ProductEntity[],
  totalDocs: 2,
} as PaginatedDocs<ProductEntity>;

export const createProductListFixture = (override?: Partial<typeof baseProductListFixture>) => {
  return {
    ...baseProductListFixture,
    ...override,
  };
};

export const baseProductCategoryEntityFixture = { id: 1, name: '의약품' } as ProductCategoryEntity;

export const createProductCategoryEntityFixture = (
  override?: Partial<typeof baseProductCategoryEntityFixture>,
): ProductCategoryEntity => {
  return {
    ...baseProductCategoryEntityFixture,
    ...override,
  };
};

export const baseProductCategoryFixture = { id: 1, name: '의약품' } as ProductCategory;

export const createProductCategoryFixture = (
  override?: Partial<typeof baseProductCategoryFixture>,
): ProductCategory => {
  return {
    ...baseProductCategoryFixture,
    ...override,
  };
};
