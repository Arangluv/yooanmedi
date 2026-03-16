import { baseProduct } from './product.fixture';

export const baseInventoryItem = {
  product: baseProduct,
  quantity: 1,
};

export const createMockInventoryItem = (override?: Partial<typeof baseInventoryItem>) => {
  return {
    ...baseInventoryItem,
    ...override,
  };
};
