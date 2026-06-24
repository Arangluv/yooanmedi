import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { ORDER_PRODUCT_STATUS } from '../constants';

export const orderProductSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '주문상품 아이디는 필수 항목입니다.',
  }),
  order: BaseSchema.collectionId({
    required_message: '주문 번호는 필수 항목입니다',
  }),
  product: BaseSchema.collectionId({
    required_message: '상품 아이디는 필수 항목입니다',
  }),
  totalAmount: BaseSchema.number({ min: 0 }),
  productDeliveryFee: BaseSchema.number({ min: 0 }),
  orderProductStatus: z.enum([
    ORDER_PRODUCT_STATUS.pending,
    ORDER_PRODUCT_STATUS.preparing,
    ORDER_PRODUCT_STATUS.shipping,
    ORDER_PRODUCT_STATUS.delivered,
    ORDER_PRODUCT_STATUS.cancelled,
    ORDER_PRODUCT_STATUS.cancel_request,
  ]),
  priceSnapshot: BaseSchema.number({ min: 0 }),
  productNameSnapshot: BaseSchema.string({
    required_message: '주문상품 이름은 필수 항목 입니다',
  }),
  quantity: BaseSchema.number({ min: 1 }),
  cashback_rate: BaseSchema.number({ min: 0 }),
  cashback_rate_for_bank: BaseSchema.number({ min: 0 }),
});

export const orderProductsSchema = z.array(orderProductSchema);
