import { ORDER_STATUS } from '@/entities/order/constants/order-status';
import { FLG_STATUS } from '@/entities/order/constants/flg-status';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

import { createOrderSchema } from '@/entities/order/model/create-order.schema';
import { InventoryItem } from '@/entities/inventory/model/inventory-schema';
import { createOrderProductSchema } from '@/entities/order-product/model/create-order-product.schema';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';

interface BuildCreateOrderDtoProps {
  user: number;
  orderNo: string;
  orderRequest: string;
  finalPrice: number;
  usedPoint: number;
}

const DEFAULT_ORDER_DELIVERY_FEE = 0; // 현재는 사용하지 않지만, 묶음 배송비 기능 추가 시 적용

export const buildBankTransferOrderDto = ({
  user,
  orderNo,
  orderRequest,
  finalPrice,
  usedPoint,
}: BuildCreateOrderDtoProps) => {
  return createOrderSchema.parse({
    orderStatus: ORDER_STATUS.PENDING,
    flgStatus: FLG_STATUS.INIT_NORMAL,
    paymentStatus: PAYMENT_STATUS.PENDING,
    orderDeliveryFee: 0,
    paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
    user,
    orderNo,
    orderRequest,
    finalPrice,
    usedPoint,
  });
};

export const buildCreateCreditCardOrderDto = ({
  user,
  orderNo,
  orderRequest,
  finalPrice,
  usedPoint,
}: BuildCreateOrderDtoProps) => {
  return createOrderSchema.parse({
    orderStatus: ORDER_STATUS.PREPARING,
    flgStatus: FLG_STATUS.INIT_NORMAL,
    paymentStatus: PAYMENT_STATUS.COMPLETE,
    orderDeliveryFee: DEFAULT_ORDER_DELIVERY_FEE,
    paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    user,
    orderNo,
    orderRequest,
    finalPrice,
    usedPoint,
  });
};

interface BuildCreateOrderProductDtoProps {
  orderId: number;
  totalAmount: number;
  productDeliveryFee: number;
  inventoryItem: InventoryItem;
}

export const buildBankTransferOrderProductDto = ({
  orderId,
  totalAmount,
  productDeliveryFee,
  inventoryItem,
}: BuildCreateOrderProductDtoProps) => {
  return createOrderProductSchema.parse({
    order: orderId,
    totalAmount,
    productDeliveryFee,
    orderProductStatus: ORDER_PRODUCT_STATUS.PENDING,
    product: inventoryItem.product.id,
    priceSnapshot: inventoryItem.product.price,
    productNameSnapshot: inventoryItem.product.name,
    quantity: inventoryItem.quantity,
    cashback_rate: inventoryItem.product.cashback_rate,
    cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
  });
};

export const buildCreateCreditCardOrderProductDto = ({
  orderId,
  totalAmount,
  productDeliveryFee,
  inventoryItem,
}: BuildCreateOrderProductDtoProps) => {
  return createOrderProductSchema.parse({
    order: orderId,
    totalAmount,
    productDeliveryFee,
    orderProductStatus: ORDER_PRODUCT_STATUS.PREPARING,
    product: inventoryItem.product.id,
    priceSnapshot: inventoryItem.product.price,
    productNameSnapshot: inventoryItem.product.name,
    quantity: inventoryItem.quantity,
    cashback_rate: inventoryItem.product.cashback_rate,
    cashback_rate_for_bank: inventoryItem.product.cashback_rate_for_bank,
  });
};
