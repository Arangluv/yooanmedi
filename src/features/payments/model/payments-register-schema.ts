import * as z from 'zod';

import type { InventoryItem } from '@/entities/inventory';

type OrderInfo = {
  goodsName: string;
  customerInfo: {
    customerId: string;
    customerName: string;
    customerMail: string;
    customerContactNo: string;
    customerAddr: string;
  };
};

type ShopValueInfo = {
  deliveryRequest: string; // value1
  orderList: Array<{
    product: Pick<InventoryItem['product'], 'id' | 'price'>;
    quantity: InventoryItem['quantity'];
  }>; // value2
  usedPoint: number; // value3
  userId: string;
  paymentsMethod: 'creditCard' | 'bankTransfer';
  minOrderPrice: number; // value6
};

type PaymentsRegisterDTO = {
  mallId: string;
  amount: number;
  clientTypeCode: '00'; // 고정값
  payMethodTypeCode: '11'; // 신용카드 결제만 지원하므로 고정
  currency: '00'; // 원화 결제만 지원하므로 고정
  deviceTypeCode: 'pc'; // 모바일 환경은 지원하지 않으므로 고정
  returnUrl: string;
  shopOrderNo: string;
  orderInfo: OrderInfo;
  shopValueInfo: ShopValueInfo;
};

// zod로 다시
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

const shopValueInfoDtoSchema = z.object({
  deliveryRequest: z.string(),
  orderList: z.array(
    z.object({
      product: z.object({ id: z.string(), price: z.number() }),
      quantity: z.number(),
    }),
  ),
  usedPoint: z.number(),
  userId: z.string(),
  paymentsMethod: z.enum(['creditCard', 'bankTransfer']),
  minOrderPrice: z.number(),
});

const shopValueInfoEntitySchema = z.object({
  value1: z.string(),
  value2: z.array(
    z.object({
      product: z.object({ id: z.string(), price: z.number() }),
      quantity: z.number(),
    }),
  ),
  value3: z.number(),
  value4: z.string(),
  value5: z.enum(['creditCard', 'bankTransfer']),
  value6: z.number(),
});

const paymentsRegisterBaseSchema = z.object({
  mallId: z.string(),
  amount: z.number(),
  clientTypeCode: z.literal('00'),
  payMethodTypeCode: z.literal('11'),
  currency: z.literal('00'),
  deviceTypeCode: z.literal('pc'),
  returnUrl: z.string(),
  shopOrderNo: z.string(),
  orderInfo: orderInfoSchema,
});

export type PaymentsRegisterDto = z.output<typeof paymentsRegisterDtoSchema>;
export const paymentsRegisterDtoSchema = paymentsRegisterBaseSchema.extend({
  shopValueInfo: shopValueInfoDtoSchema,
});

export type PaymentsRegisterBase = z.output<typeof paymentsRegisterEntitySchema>;
export const paymentsRegisterEntitySchema = paymentsRegisterBaseSchema.extend({
  shopValueInfo: shopValueInfoEntitySchema,
});
