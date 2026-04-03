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

export const PaymentDto = {
  createOrder: (context: PGPaymentContextAfterApproval | BankTransferPaymentInitContext) => {
    const dto = {
      user: context.userId,
      orderNo: context.shopOrderNo,
      orderRequest: context.deliveryRequest,
      finalPrice: context.amount,
      usedPoint: context.usedPoint,
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
    inventoryItem: InventoryItem,
    totalAmount: number,
    productDeliveryFee: number,
  ) => {
    const dto = {
      order: context.orderId,
      totalAmount,
      productDeliveryFee,
      product: inventoryItem.product.id,
      priceSnapshot: inventoryItem.product.price,
      productNameSnapshot: inventoryItem.product.name,
      quantity: inventoryItem.quantity,
      cashback_rate: inventoryItem.product.cashback_rate,
      cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
      orderProductStatus: ORDER_PRODUCT_STATUS.PREPARING,
    };
    const result = zodSafeParse(createOrderProductSchema, dto);
    return result;
  },

  createOrderProductForBankTransfer: (
    context: BankTransferPaymentContextAfterOrder,
    inventoryItem: InventoryItem,
    totalAmount: number,
    productDeliveryFee: number,
  ) => {
    const dto = {
      order: context.orderId,
      totalAmount,
      productDeliveryFee,
      orderProductStatus: ORDER_PRODUCT_STATUS.PENDING,
      product: inventoryItem.product.id,
      priceSnapshot: inventoryItem.product.price,
      productNameSnapshot: inventoryItem.product.name,
      quantity: inventoryItem.quantity,
      cashback_rate: inventoryItem.product.cashback_rate,
      cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
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
