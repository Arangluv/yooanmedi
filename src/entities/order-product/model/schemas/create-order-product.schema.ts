import { z } from 'zod';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

const createBaseOrderProductSchema = z.object({
  order: z.number('주문 ID는 비어있을 수 없습니다.'),
  totalAmount: z.number('총 금액은 비어있을 수 없습니다.').min(0, '총 금액은 0 이상이어야 합니다.'),
  productDeliveryFee: z
    .number('상품 배송비는 비어있을 수 없습니다.')
    .min(0, '상품 배송비는 0 이상이어야 합니다.'),
  product: z.number('상품 ID는 비어있을 수 없습니다.'),
  priceSnapshot: z
    .number('상품 가격은 비어있을 수 없습니다.')
    .min(0, '상품 가격은 0 이상이어야 합니다.'),
  productNameSnapshot: z.string('상품 이름은 비어있을 수 없습니다.'),
  quantity: z.number('수량은 비어있을 수 없습니다.').min(1, '수량은 1 이상이어야 합니다.'),
  cashback_rate: z
    .number('카드 적립금 비율은 비어있을 수 없습니다.')
    .min(0, '카드 적립금 비율은 0 이상이어야 합니다.'),
  cashback_rate_for_bank: z
    .number('무통장 입금 적립금 비율은 비어있을 수 없습니다.')
    .min(0, '무통장 입금 적립금 비율은 0 이상이어야 합니다.'),
});

const createBankTransferOrderProductPipe = createBaseOrderProductSchema.extend({
  orderProductStatus: z.literal(ORDER_PRODUCT_STATUS.pending),
});
export const createBankTransferOrderProductSchema = createBaseOrderProductSchema
  .transform((data) => {
    return {
      ...data,
      orderProductStatus: ORDER_PRODUCT_STATUS.pending,
    };
  })
  .pipe(createBankTransferOrderProductPipe);

const createCreditCardOrderProductPipe = createBaseOrderProductSchema.extend({
  orderProductStatus: z.literal(ORDER_PRODUCT_STATUS.preparing),
});

export const createCreditCardOrderProductSchema = createBaseOrderProductSchema
  .transform((data) => {
    return {
      ...data,
      orderProductStatus: ORDER_PRODUCT_STATUS.preparing,
    };
  })
  .pipe(createCreditCardOrderProductPipe);

export const createOrderProductSchema = z.union([
  createBankTransferOrderProductSchema,
  createCreditCardOrderProductSchema,
]);

export type CreateOrderProductRequestDto = z.input<typeof createOrderProductSchema>;
export type CreateOrderProductEntity = z.infer<typeof createOrderProductSchema>;
export interface CreateOrderProductResponseDto {
  id: number;
}
