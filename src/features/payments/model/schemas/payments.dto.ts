import { type InventoryItem } from '@/entities/inventory/model/inventory-schema';
import type { BasePaymentContext } from './payments-context/base.schema';
import type {
  BankTransferPaymentInitContext,
  BankTransferPaymentAfterOrderContext,
} from './payments-context/bank-transfer.schema';
import type {
  PGPaymentInitContext,
  PGPaymentAfterApprovalContext,
  PGPaymentAfterOrderContext,
} from './payments-context/pg.schema';
import { type EnrichedOrderListItem } from './payment-order-list.schema';

export const PaymentDto = {
  createOrderForPG: (context: PGPaymentAfterApprovalContext) => {
    const dto = {
      user: context.userId,
      orderNo: context.shopOrderNo,
      orderRequest: context.deliveryRequest,
      finalPrice: context.amount,
      usedPoint: context.usedPoint,
    };

    return dto;
  },
  createOrderForBankTransfer: (context: BankTransferPaymentInitContext) => {
    const dto = {
      user: context.userId,
      orderNo: context.shopOrderNo,
      orderRequest: context.deliveryRequest,
      finalPrice: context.amount,
      usedPoint: context.usedPoint,
    };

    return dto;
  },

  approvePayment: (context: PGPaymentInitContext) => {
    const dto = {
      authorizationId: context.authorizationId,
      shopOrderNo: context.shopOrderNo,
    };

    return dto;
  },

  createOrderProduct: (
    context: PGPaymentAfterOrderContext | BankTransferPaymentAfterOrderContext,
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
    };

    return dto;
  },

  createRecentPurchasedHistory: (context: BasePaymentContext, inventoryItem: InventoryItem) => {
    const dto = {
      user: context.userId,
      product: inventoryItem.product.id,
      quantity: inventoryItem.quantity,
      amount: inventoryItem.product.price,
    };

    return dto;
  },

  createPaymentHistory: (context: PGPaymentAfterOrderContext) => {
    const dto = {
      order: context.orderId,
      amount: context.amount,
      pgCno: context.pgCno,
    };

    return dto;
  },
};
