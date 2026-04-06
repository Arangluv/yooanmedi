import { z } from 'zod';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

const createBaseOrderProductSchema = z.object({
  order: z.number(),
  totalAmount: z.number(),
  productDeliveryFee: z.number(),
  product: z.number(),
  priceSnapshot: z.number(),
  productNameSnapshot: z.string(),
  quantity: z.number(),
  cashback_rate: z.number(),
  cashback_rate_for_bank: z.number(),
});

const createBankTransferOrderProductSchema = createBaseOrderProductSchema.extend({
  orderProductStatus: z.literal(ORDER_PRODUCT_STATUS.PENDING),
});

const createCreditCardOrderProductSchema = createBaseOrderProductSchema.extend({
  orderProductStatus: z.literal(ORDER_PRODUCT_STATUS.PREPARING),
});

export const createOrderProductSchema = z.union([
  createBankTransferOrderProductSchema,
  createCreditCardOrderProductSchema,
]);

export type CreateOrderProductDto = z.input<typeof createOrderProductSchema>;
