export const ORDER_PRODUCT_STATUS = {
  pending: 'pending', // 입금확인
  preparing: 'preparing', // 상품준비
  shipping: 'shipping', // 배송시작
  delivered: 'delivered', // 배송완료
  cancel_request: 'cancel_request', // 취소 요청
  cancelled: 'cancelled', // 주문취소
} as const;

export const ORDER_PRODUCT_STATUS_NAME = {
  [ORDER_PRODUCT_STATUS.pending]: '입금확인중',
  [ORDER_PRODUCT_STATUS.preparing]: '상품준비',
  [ORDER_PRODUCT_STATUS.shipping]: '배송시작',
  [ORDER_PRODUCT_STATUS.delivered]: '배송완료',
  [ORDER_PRODUCT_STATUS.cancel_request]: '취소요청',
  [ORDER_PRODUCT_STATUS.cancelled]: '주문취소',
} as const;

export type OrderProductStatus = (typeof ORDER_PRODUCT_STATUS)[keyof typeof ORDER_PRODUCT_STATUS];
export type OrderProductStatusKey = keyof typeof ORDER_PRODUCT_STATUS;
