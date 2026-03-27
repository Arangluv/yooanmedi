import { createOrderSchema } from '@/entities/order/model/create-order.schema';
import {
  BankTransferPaymentContext,
  BasePaymentContext,
  PGPaymentContext,
} from './payment-context-schema';
import { approvalPaymentSchema } from './payments-approval-schema';
import { createOrderProductSchema } from '@/entities/order-product/model/create-order-product.schema';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';
import { createPaymentSchema } from '@/entities/payment/model/create-schema';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

export const PaymentDto = {
  createOrder: (context: BasePaymentContext) => {
    return createOrderSchema.parse({
      user: context.userId,
      orderNo: context.shopOrderNo,
      orderRequest: context.deliveryRequest,
      finalPrice: context.amount,
      usedPoint: context.usedPoint,
    });
  },
  approvePayment: (context: BasePaymentContext) => {
    return approvalPaymentSchema.parse({
      mallId: process.env.PAYMENTS_MID as string,
      authorizationId: context.authorizationId,
      shopOrderNo: context.shopOrderNo,
    });
  },
  createOrderProductForPg: (
    context: PGPaymentContext,
    inventoryItem: InventoryItem,
    totalAmount: number,
    productDeliveryFee: number,
  ) => {
    return createOrderProductSchema.parse({
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
    });
  },

  createOrderProductForBankTransfer: (context: BankTransferPaymentContext) => {},

  createRecentPurchasedHistory: (context: BasePaymentContext, inventoryItem: InventoryItem) => {
    return createRecentPurchasedHistorySchema.parse({
      user: context.userId,
      product: inventoryItem.product.id,
      quantity: inventoryItem.quantity,
      amount: inventoryItem.product.price,
    });
  },

  createPaymentHistory: (context: PGPaymentContext) => {
    return createPaymentSchema.parse({
      order: context.orderId,
      amount: context.amount,
      pgCno: context.pgCno,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    });
  },
};
