import { ORDER_PRODUCT_STATUS, type OrderProductStatus } from '@/entities/order-product';

export const isFullyCancelRequest = (statuses: OrderProductStatus[]) => {
  return statuses.every((status) => status === ORDER_PRODUCT_STATUS.cancel_request);
};

export const isFullyCancelled = (statuses: OrderProductStatus[]) => {
  return statuses.every((status) => status === ORDER_PRODUCT_STATUS.cancelled);
};
