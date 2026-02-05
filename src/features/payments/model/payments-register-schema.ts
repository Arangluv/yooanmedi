import * as z from 'zod';

import { PAYMENTS_METHOD } from '../constants/payments-options';

const orderInfoSchema = z.object({
  goodsName: z.string(),
  customerInfo: z.object({
    customerId: z.string(),
    customerName: z.string(),
    customerMail: z.string(),
    customerContactNo: z.string(),
    customerAddr: z.string(),
  }),
});

const shopValueInfoApplicationDtoSchema = z.object({
  deliveryRequest: z.string(),
  orderList: z.array(
    z.object({
      product: z.object({ id: z.number(), price: z.number() }),
      quantity: z.number(),
    }),
  ),
  usedPoint: z.number(),
  userId: z.number(),
  paymentsMethod: z.enum([PAYMENTS_METHOD.CREDIT_CARD, PAYMENTS_METHOD.BANK_TRANSFER]),
  minOrderPrice: z.number(),
});

const shopValueInfoRequestDtoSchema = z.object({
  value1: z.string(),
  value2: z.json(),
  value3: z.number(),
  value4: z.number(),
  value5: z.enum([PAYMENTS_METHOD.CREDIT_CARD, PAYMENTS_METHOD.BANK_TRANSFER]),
  value6: z.number(),
});

const paymentsRegisterBaseSchema = z.object({
  amount: z.number(),
  clientTypeCode: z.literal('00'),
  payMethodTypeCode: z.literal('11'),
  currency: z.literal('00'),
  deviceTypeCode: z.literal('pc'),
  returnUrl: z.string(),
  shopOrderNo: z.string(),
  orderInfo: orderInfoSchema,
});

export type PaymentsRegisterApplicationDto = z.output<typeof paymentsRegisterApplicationDtoSchema>;
export const paymentsRegisterApplicationDtoSchema = paymentsRegisterBaseSchema.extend({
  shopValueInfo: shopValueInfoApplicationDtoSchema,
});

export type PaymentsRegisterRequestDto = z.output<typeof paymentsRegisterRequestDtoSchema>;
export const paymentsRegisterRequestDtoSchema = paymentsRegisterBaseSchema.extend({
  mallId: z.string(),
  shopValueInfo: shopValueInfoRequestDtoSchema,
});
