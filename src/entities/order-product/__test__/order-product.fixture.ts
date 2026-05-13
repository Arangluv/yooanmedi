import { type OrderProduct } from '../model/schemas/order-product.schema';

const baseOrderProductFixture = {
  id: 1179,
  product: 1685,
  order: 644,
  orderProductStatus: 'preparing',
  productNameSnapshot: '둘코락스좌약',
  priceSnapshot: 2000,
  totalAmount: 2000,
  productDeliveryFee: 0,
  quantity: 1,
  cashback_rate: 0.5,
  cashback_rate_for_bank: 1.5,
  updatedAt: '2026-05-04T04:49:04.470Z',
  createdAt: '2026-05-04T04:49:04.852Z',
} as OrderProduct;

export const createOrderProductFixture = (
  override?: Partial<typeof baseOrderProductFixture>,
): OrderProduct => {
  return {
    ...baseOrderProductFixture,
    ...override,
  };
};
