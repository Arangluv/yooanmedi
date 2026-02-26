import {
  ORDER_PRODUCT_STATUS,
  OrderProductStatus,
} from '@/entities/order-product/constants/order-product-status';
import { OrderStatus } from '@/entities/order/constants/order-status';
import { PaymentStatus } from '@/entities/order/constants/payment-status';
import { PaymentsMethod } from '@/entities/order/constants/payments-options';
import type { Order } from '@/entities/order/model/type';
import { Image } from '@/payload-types';
import { isPayloadImageRenderable } from '@/shared';

// TODO: Error boundary refactoring 필요
// createOrderUserInfo에서 string으로 타입단언 -> 개선필요함

export type CollectionViewOrderData = {
  orderInfo: {
    progressOrder: {
      id: number;
      date: string;
      orderNo: string;
      orderStatus: OrderStatus;
      orderProducts: CollectionViewOrderProduct[];
    };
    cancelRequestOrder: {
      id: number;
      date: string;
      orderNo: string;
      orderProducts: CollectionViewOrderProduct[];
    };
    cancelledOrder: {
      id: number;
      orderNo: string;
      orderProducts: CollectionViewOrderProduct[];
    };
  };
  paymentInfo: {
    paymentMethod: PaymentsMethod;
    paymentStatus: PaymentStatus;
    usedPoint: number;
    finalPrice: number;
  };
  orderUserInfo: {
    hospitalName: string;
    phoneNumber: string;
    email: string;
    ceo: string;
  };
  deliveryInfo: {
    address: string;
    orderRequest: string;
  };
};

export const normalizeOrderData = (orderRowData: Order | null | undefined) => {
  if (!orderRowData) {
    return null;
  }

  const orderInfo = createCollectionViewOrderProductsInfo(orderRowData);
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

export type CollectionViewOrderProduct = {
  id: number;
  quantity: number;
  totalAmount: number;
  image: Image | null;
  orderProductStatus: OrderProductStatus;
  productDeliveryFee: number;
  productNameSnapshot: string;
  priceSnapshot: number;
};

const createCollectionViewOrderProductsInfo = (orderRowData: Order) => {
  const orderInfo = {
    progressOrder: {
      id: orderRowData.id,
      date: orderRowData.createdAt,
      orderNo: orderRowData.orderNo,
      orderStatus: '' as OrderStatus,
      orderProducts: [] as CollectionViewOrderProduct[],
    },
    cancelRequestOrder: {
      id: orderRowData.id,
      date: orderRowData.updatedAt,
      orderNo: orderRowData.orderNo,
      orderProducts: [] as CollectionViewOrderProduct[],
    },
    cancelledOrder: {
      id: orderRowData.id,
      orderNo: orderRowData.orderNo,
      orderProducts: [] as CollectionViewOrderProduct[],
    },
  };

  if (!orderRowData.orderProducts) {
    throw new Error('주문 상품 정보를 가져오는데 문제가 발생했습니다');
  }

  const orderProducts = orderRowData.orderProducts.docs;
  if (!orderProducts) {
    throw new Error('주문 상품 정보를 가져오는데 문제가 발생했습니다');
  }

  orderProducts.forEach((orderProduct) => {
    if (typeof orderProduct === 'object' && typeof orderProduct.product === 'object') {
      const orderProductInfo = {
        id: orderProduct.id,
        quantity: orderProduct.quantity,
        totalAmount: orderProduct.totalAmount,
        image: isPayloadImageRenderable(orderProduct.product.image)
          ? (orderProduct.product.image as Image)
          : null,
        orderProductStatus: orderProduct.orderProductStatus,
        productDeliveryFee: orderProduct.productDeliveryFee,
        productNameSnapshot: orderProduct.productNameSnapshot,
        priceSnapshot: orderProduct.priceSnapshot,
      };

      switch (orderProduct.orderProductStatus) {
        case ORDER_PRODUCT_STATUS.CANCEL_REQUEST:
          orderInfo.cancelRequestOrder.orderProducts.push(orderProductInfo);
          break;
        case ORDER_PRODUCT_STATUS.CANCELLED:
          orderInfo.cancelledOrder.orderProducts.push(orderProductInfo);
          break;
        default:
          // TODO: 이 부분 개선 필요
          // 취소, 취소요청이 아닌 order-product의 상태를 check하는 함수 필요함
          orderInfo.progressOrder.orderStatus = orderProduct.orderProductStatus;
          orderInfo.progressOrder.orderProducts.push(orderProductInfo);
          break;
      }
    }
  });

  return orderInfo;
};

const createPaymentInfo = (orderRowData: Order) => {
  return {
    paymentMethod: orderRowData.paymentsMethod,
    paymentStatus: orderRowData.paymentStatus,
    usedPoint: orderRowData.usedPoint,
    finalPrice: orderRowData.finalPrice,
  };
};

const createOrderUserInfo = (orderRowData: Order) => {
  if (typeof orderRowData.user !== 'object') {
    throw new Error('유저 정보를 가져오는데 문제가 발생했습니다');
  }

  return {
    hospitalName: orderRowData.user.hospitalName as string,
    phoneNumber: orderRowData.user.phoneNumber as string,
    email: orderRowData.user.email as string,
    ceo: orderRowData.user.ceo as string,
  };
};

const createDeliveryInfo = (orderRowData: Order) => {
  if (typeof orderRowData.user !== 'object') {
    throw new Error('배송 정보를 가져오는데 문제가 발생했습니다');
  }

  return {
    address: orderRowData.user.address as string,
    orderRequest: orderRowData.orderRequest ? orderRowData.orderRequest : '',
  };
};
