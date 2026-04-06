import { ORDER_PRODUCT_STATUS } from '@/entities/order-product/constants/order-product-status';
import { OrderStatus } from '@/entities/order/constants/order-status';
import type { Order } from '@/entities/order/model/type';

import {
  orderProductsArraySchema,
  orderUserInfoSchema,
  paymentInfoSchema,
  deliveryInfoSchema,
  orderInformationSchema,
} from '../model/order-detail-schema';
import type {
  OrderProduct,
  OrderInformation,
  OrderUserInfo,
  PaymentInfo,
  DeliveryInfo,
} from '../model/order-detail-schema';

// TODO: Error boundary refactoring 필요
export type CollectionViewOrderData = {
  orderInfo: OrderInformation;
  paymentInfo: PaymentInfo;
  orderUserInfo: OrderUserInfo;
  deliveryInfo: DeliveryInfo;
};

export const normalizeOrderData = (orderRowData: Order) => {
  const orderInfo = createOrderProductsInfo(orderRowData);
  const paymentInfo = createPaymentInfo(orderRowData);
  const orderUserInfo = createOrderUserInfo(orderRowData);
  const deliveryInfo = createDeliveryInfo(orderRowData);

  return {
    orderInfo,
    paymentInfo,
    orderUserInfo,
    deliveryInfo,
  };
};

const createOrderProductsInfo = (orderRowData: Order) => {
  const orderProductsInfo = {
    id: orderRowData.id,
    createdAt: orderRowData.createdAt,
    updatedAt: orderRowData.updatedAt,
    orderNo: orderRowData.orderNo,
    progressOrder: {
      inProgressOrderStatus: null as OrderStatus | null,
      orderProducts: [] as OrderProduct[],
    },
    cancelRequestOrder: {
      orderProducts: [] as OrderProduct[],
    },
    cancelledOrder: {
      orderProducts: [] as OrderProduct[],
    },
  };

  // step 1. 진행중인 주문 / 취소요청 주문 / 취소처리된 주문 분류
  const orderProducts = orderProductsArraySchema.parse(orderRowData?.orderProducts?.docs);
  orderProducts.forEach((orderProduct) => {
    switch (orderProduct.orderProductStatus) {
      case ORDER_PRODUCT_STATUS.CANCEL_REQUEST:
        orderProductsInfo.cancelRequestOrder.orderProducts.push(orderProduct);
        break;
      case ORDER_PRODUCT_STATUS.CANCELLED:
        orderProductsInfo.cancelledOrder.orderProducts.push(orderProduct);
        break;
      default:
        orderProductsInfo.progressOrder.orderProducts.push(orderProduct);
        break;
    }
  });

  // step 2. 진행중인 주문상품의 진행상태 결정
  const inProgressOrderProducts = orderProductsInfo.progressOrder.orderProducts;
  const progressOrderStatus = inProgressOrderProducts.map(
    (orderProduct) => orderProduct.orderProductStatus,
  );

  const statusSet = new Set(progressOrderStatus);
  if (statusSet.size > 1) {
    throw new Error('[System] 진행중인 주문은 개별적인 상태를 가질 수 없습니다');
  }

  if (statusSet.size === 1) {
    // 진행중인 주문상품은 모두 같은 상태를 가진다. (첫번째 상품의 상태를 사용)
    const FIRST_INDEX_FOR_COMMON_PROGRESS = 0;
    orderProductsInfo.progressOrder.inProgressOrderStatus =
      progressOrderStatus[FIRST_INDEX_FOR_COMMON_PROGRESS];
  }

  console.log('orderProductsInfo');
  console.log(orderProductsInfo);
  const orderInformation = orderInformationSchema.parse(orderProductsInfo);

  return orderInformation;
};

const createPaymentInfo = (orderRowData: Order) => {
  const paymentInfoDto = {
    paymentMethod: orderRowData.paymentsMethod,
    paymentStatus: orderRowData.paymentStatus,
    usedPoint: orderRowData.usedPoint,
    finalPrice: orderRowData.finalPrice,
  };

  const paymentInfo = paymentInfoSchema.parse(paymentInfoDto);

  return paymentInfo;
};

const createOrderUserInfo = (orderRowData: Order) => {
  const orderUserInfo = orderUserInfoSchema.parse(orderRowData.user);

  return orderUserInfo;
};

const createDeliveryInfo = (orderRowData: Order) => {
  const deliveryInfoDto = {
    user: orderRowData.user,
    orderRequest: orderRowData.orderRequest ? orderRowData.orderRequest : '',
  };

  const deliveryInfo = deliveryInfoSchema.parse(deliveryInfoDto);

  return deliveryInfo;
};
