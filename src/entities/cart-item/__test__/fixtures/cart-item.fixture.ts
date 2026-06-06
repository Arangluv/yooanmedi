import { CartItem, CartItemEntity } from '../../types';

export const baseCartItemEntityFixture = {
  id: 180,
  carts: { id: 8 },
  product: {
    id: 1683,
    image: null,
    name: '부로멜라장용정',
    category: null,
    insurance_code: '649801890',
    specification: '100mg/300T',
    manufacturer: '(사용X)명문제약',
    ingredient: 'proteolytic peptide from porcine brain 2.152g(0.2152g/mL)',
    stock: 999,
    is_best_product: true,
    returnable: false,
    price: 18000,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
    updatedAt: '2026-02-23T06:36:58.652Z',
    createdAt: '2026-02-14T10:00:24.752Z',
  },
  quantity: 1,
  updatedAt: '2026-05-08T05:30:21.348Z',
  createdAt: '2026-05-08T05:30:22.089Z',
} as CartItemEntity;

export const createCartItemEntityFixture = (override?: Partial<CartItemEntity>) => {
  return {
    ...baseCartItemEntityFixture,
    ...override,
  };
};

export const baseCartItemFixture = {
  id: 180,
  carts: { id: 8 },
  product: {
    id: 1683,
    image: null,
    name: '부로멜라장용정',
    category: null,
    insurance_code: '649801890',
    specification: '100mg/300T',
    manufacturer: '(사용X)명문제약',
    ingredient: 'proteolytic peptide from porcine brain 2.152g(0.2152g/mL)',
    stock: 999,
    is_best_product: true,
    returnable: false,
    price: 18000,
    cashback_rate: 0.5,
    cashback_rate_for_bank: 1.5,
    delivery_fee: 0,
    is_cost_per_unit: false,
    is_free_delivery: false,
  },
  quantity: 1,
} as CartItem;

export const createCartItemFixture = (override?: Partial<CartItem>) => {
  return {
    ...baseCartItemFixture,
    ...override,
  };
};
