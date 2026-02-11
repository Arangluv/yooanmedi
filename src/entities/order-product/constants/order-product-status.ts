export const ORDER_PRODUCT_STATUS = {
  ORDERED: 'ordered', // 주문 완료
  CANCEL_REQUEST: 'cancel_request', // 취소 요청
  CANCELLED: 'cancelled', // 취소 완료
} as const;

export const ORDER_PRODUCT_STATUS_NAME = {
  [ORDER_PRODUCT_STATUS.ORDERED]: '주문 완료',
  [ORDER_PRODUCT_STATUS.CANCEL_REQUEST]: '취소 요청',
  [ORDER_PRODUCT_STATUS.CANCELLED]: '취소 완료',
} as const;
