import { createOrderSchema } from '@/entities/order/model/create-order.schema';
import {
  BasePaymentContext,
  BankTransferPaymentInitContext,
  BankTransferPaymentContextAfterOrder,
  PGPaymentInitContext,
  PGPaymentContextAfterApproval,
  PGPaymentContextAfterOrder,
} from './payment-context-schema';
import { approvalPaymentRequestDtoSchema } from './payments-approval-schema';
import { createOrderProductSchema } from '@/entities/order-product/model/create-order-product.schema';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';
import { createPaymentSchema } from '@/entities/payment/model/create-schema';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { zodSafeParse } from '@/shared/lib/zod';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { ORDER_STATUS } from '@/entities/order';
import { EnrichedOrderListItem } from './order-list.schema';

export const PaymentDto = {
  createOrderForPG: (context: PGPaymentContextAfterApproval) => {
    const dto = {
      user: context.userId,
      orderNo: context.shopOrderNo,
      orderRequest: context.deliveryRequest,
      finalPrice: context.amount,
      usedPoint: context.usedPoint,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.COMPLETE,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
      orderStatus: ORDER_STATUS.PREPARING,
    };

    const result = zodSafeParse(createOrderSchema, dto);
    return result;
  },
  createOrderForBankTransfer: (context: BankTransferPaymentInitContext) => {
    const dto = {
      user: context.userId,
      orderNo: context.shopOrderNo,
      orderRequest: context.deliveryRequest,
      finalPrice: context.amount,
      usedPoint: context.usedPoint,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
      orderStatus: ORDER_STATUS.PENDING,
    };

    const result = zodSafeParse(createOrderSchema, dto);
    return result;
  },

  approvePayment: (context: PGPaymentInitContext) => {
    const dto = {
      mallId: process.env.PAYMENTS_MID,
      authorizationId: context.authorizationId,
      shopOrderNo: context.shopOrderNo,
    };

    const result = zodSafeParse(approvalPaymentRequestDtoSchema, dto);
    return result;
  },

  createOrderProductForPg: (
    context: PGPaymentContextAfterOrder,
    orderListItem: EnrichedOrderListItem,
  ) => {
    const dto = {
      order: context.orderId,
      totalAmount: orderListItem.totalAmount,
      productDeliveryFee: orderListItem.orderProductDeliveryFee,
      product: orderListItem.product.id,
      priceSnapshot: orderListItem.product.price,
      productNameSnapshot: orderListItem.product.name,
      quantity: orderListItem.quantity,
      cashback_rate: orderListItem.product.cashback_rate,
      cashback_rate_for_bank: orderListItem.product.cashback_rate_for_bank,
      orderProductStatus: ORDER_PRODUCT_STATUS.PREPARING,
    };
    const result = zodSafeParse(createOrderProductSchema, dto);
    return result;
  },

  createOrderProductForBankTransfer: (
    context: BankTransferPaymentContextAfterOrder,
    orderListItem: EnrichedOrderListItem,
  ) => {
    const dto = {
      order: context.orderId,
      totalAmount: orderListItem.totalAmount,
      productDeliveryFee: orderListItem.orderProductDeliveryFee,
      orderProductStatus: ORDER_PRODUCT_STATUS.PENDING,
      product: orderListItem.product.id,
      priceSnapshot: orderListItem.product.price,
      productNameSnapshot: orderListItem.product.name,
      quantity: orderListItem.quantity,
      cashback_rate: orderListItem.product.cashback_rate,
      cashback_rate_for_bank: orderListItem.product.cashback_rate_for_bank,
    };

    const result = zodSafeParse(createOrderProductSchema, dto);
    return result;
  },

  createRecentPurchasedHistory: (context: BasePaymentContext, inventoryItem: InventoryItem) => {
    const dto = {
      user: context.userId,
      product: inventoryItem.product.id,
      quantity: inventoryItem.quantity,
      amount: inventoryItem.product.price,
    };

    const result = zodSafeParse(createRecentPurchasedHistorySchema, dto);
    return result;
  },

  createPaymentHistory: (context: PGPaymentContextAfterOrder) => {
    const dto = {
      order: context.orderId,
      amount: context.amount,
      pgCno: context.pgCno,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    };

    const result = zodSafeParse(createPaymentSchema, dto);
    return result;
  },
};
