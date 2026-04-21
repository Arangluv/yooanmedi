import { z } from 'zod';
import moment from 'moment';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';

const product = z.object({
  id: z.number(),
  price: z.number().min(0, '상품 가격은 음수가 될 수 없습니다.'),
});
const quantity = z.number().min(1, '주문 수량은 1 이상이어야 합니다.');

const orderItem = z.object({
  product: product,
  quantity: quantity,
});

export const baseSchema = {
  orderList: z.array(orderItem).min(1, '주문 상품은 비어있을 수 없습니다.'),
  shopOrderNo: z.string().length(15, '주문 번호는 비어있을 수 없습니다.'),
  userId: z.number('유저를 찾을 수 없습니다.'),
  usedPoint: z.number().min(0, '사용 포인트는 음수가 될 수 없습니다.'),
  minOrderPrice: z.number().min(0, '최소 주문 금액은 음수가 될 수 없습니다.'),
  paymentMethodForBankTransfer: z.literal(PAYMENTS_METHOD.BANK_TRANSFER),
  paymentMethodForPG: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  pgCno: z
    .string('PG 주문번호는 비어있을 수 없습니다.')
    .length(20, '유효하지 않은 PG 주문번호입니다.'),
  amount: z.number().min(0, '결제 금액은 음수가 될 수 없습니다.'),
  orderId: z.number('주문을 찾을 수 없습니다.'),
  deliveryRequest: z.string(),
  approvalDate: z
    .string()
    .refine((val) => {
      return moment(val, 'YYYYMMDDHHmmss').isValid();
    }, 'approvalDate는 YYYYMMDDHHmmss 형식이어야 합니다.')
    .transform((val) => moment(val, 'YYYYMMDDHHmmss').toISOString()),
  authorizationId: z
    .string('authorizationId는 비어있을 수 없습니다.')
    .length(20, 'authorizationId는 20자리여야 합니다.'),
  resSuccessCode: z.literal(EASYPAY_CONFIG.successResponseCode, '올바르지 않은 응답 코드입니다.'),
  resFailureCode: z
    .string('resFailureCode는 비어있을 수 없습니다.')
    .refine((val) => val !== EASYPAY_CONFIG.successResponseCode, '올바르지 않은 응답 코드입니다.'),
  resMsg: z.string(),
  // raw data
  shopValue1ToDeliveryRequest: z.string(),
  shopValue2ToOrderList: z.string().transform((val) => JSON.parse(val)),
  shopValue3ToUsedPoint: z.string().transform((val) => Number(val)),
  shopValue4ToUserId: z.string().transform((val) => Number(val)),
  shopValue5ToPaymentsMethod: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  shopValue6ToMinOrderPrice: z.string().transform((val) => Number(val)),
  // 가공 후
  transformedShopValue1ToDeliveryRequest: z.string(),
  transformedShopValue2ToOrderList: z.array(orderItem).min(1, '주문 상품은 비어있을 수 없습니다.'),
  transformedShopValue3ToUsedPoint: z.number().min(0, '사용 포인트는 음수가 될 수 없습니다.'),
  transformedShopValue4ToUserId: z.number('유저를 찾을 수 없습니다.'),
  transformedShopValue5ToPaymentsMethod: z.literal(PAYMENTS_METHOD.CREDIT_CARD),
  transformedShopValue6ToMinOrderPrice: z
    .number()
    .min(0, '최소 주문 금액은 음수가 될 수 없습니다.'),
  mallId: z.string('mallId는 비어있을 수 없습니다.'),
};
