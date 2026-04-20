import type {
  BasePaymentContext,
  BankTransferPaymentInitContext,
  BankTransferPaymentAfterOrderContext,
  PGPaymentInitContext,
  PGPaymentContextAfterApproval,
  PGPaymentContextAfterOrder,
} from './payments-context-schema';
import { InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { EnrichedOrderListItem } from './payment-order-list.schema';

export const PaymentDto = {
  createOrderForPG: (context: PGPaymentContextAfterApproval) => {
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
    context: PGPaymentContextAfterOrder | BankTransferPaymentAfterOrderContext,
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

  createPaymentHistory: (context: PGPaymentContextAfterOrder) => {
    const dto = {
      order: context.orderId,
      amount: context.amount,
      pgCno: context.pgCno,
    };

    return dto;
  },
};
