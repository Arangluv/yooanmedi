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
import type { CartItem } from '@/entities/cart';
import { CreateOrderProductRequestDto, ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { CreatePurchasedHistoryRequestDto } from '@/entities/purchased-history';
import { CreatePaymentHistorRequestyDto } from '@/entities/payment';
import { PAYMENTS_METHOD } from '@/shared';

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

  createOrderProductForBank: (
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
      orderProductStatus: ORDER_PRODUCT_STATUS.pending,
      cashback_rate: orderListItem.product.cashback_rate,
      cashback_rate_for_bank: orderListItem.product.cashback_rate_for_bank,
    } as CreateOrderProductRequestDto;

    return dto;
  },

  createOrderProductForPg: (
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
      orderProductStatus: ORDER_PRODUCT_STATUS.preparing,
      cashback_rate: orderListItem.product.cashback_rate,
      cashback_rate_for_bank: orderListItem.product.cashback_rate_for_bank,
    } as CreateOrderProductRequestDto;

    return dto;
  },

  createRecentPurchasedHistory: (context: BasePaymentContext, cartItem: Omit<CartItem, 'id'>) => {
    const dto = {
      user: context.userId,
      product: cartItem.product.id,
      quantity: cartItem.quantity,
      amount: cartItem.product.price,
    } as CreatePurchasedHistoryRequestDto;

    return dto;
  },

  createPaymentHistory: (context: PGPaymentAfterOrderContext) => {
    const dto: CreatePaymentHistorRequestyDto = {
      order: context.orderId,
      amount: context.amount,
      pgCno: context.pgCno,
      paymentsMethod: PAYMENTS_METHOD.credit_card,
    };

    return dto;
  },
};
