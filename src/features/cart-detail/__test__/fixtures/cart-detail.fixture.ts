import { CartDetailItemDto } from '../../dto';

const baseCartDetailItemFixture = {
  id: 1,
  carts: {
    id: 8,
  },
  product: {
    id: 9,
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
    price: 955,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
  },
  quantity: 1,
  isProcessed: true,
} as CartDetailItemDto;

export const createCartDetailItemFixture = (override?: Partial<CartDetailItemDto>) => {
  return {
    ...baseCartDetailItemFixture,
    ...override,
  };
};
