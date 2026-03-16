import type { Product } from '@/entities/product/@x/inventory';

export const baseProduct: Product = {
  id: 1681,
  image: null,
  name: '소부날캡슐200mg',
  category: null,
  insurance_code: '650300780',
  specification: '100C',
  manufacturer: '진양제약',
  ingredient: null,
  stock: 999,
  is_best_product: true,
  returnable: false,
  price: 7000,
  cashback_rate: 0.5,
  cashback_rate_for_bank: 1.5,
  delivery_fee: 0,
  is_cost_per_unit: false,
  is_free_delivery: false,
  updatedAt: '2026-02-23T06:36:58.652Z',
  createdAt: '2026-02-14T10:00:24.752Z',
};

// product fixture factory 함수
export const createMockProduct = (override?: Partial<Product>) => {
  return {
    ...baseProduct,
    ...override,
  };
};
