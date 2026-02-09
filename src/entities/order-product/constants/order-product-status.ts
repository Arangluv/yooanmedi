export const ORDER_PRODUCT_STATUS = {
  ORDERED: 'ordered', // 주문 완료
  CANCELLED: 'cancelled', // 취소 완료
  REFUNDED: 'refunded', // 환불 완료
} as const;

export const ORDER_PRODUCT_STATUS_NAME = {
  [ORDER_PRODUCT_STATUS.ORDERED]: '주문 완료',
  [ORDER_PRODUCT_STATUS.CANCELLED]: '주문 취소',
  [ORDER_PRODUCT_STATUS.REFUNDED]: '환불 처리',
} as const;
