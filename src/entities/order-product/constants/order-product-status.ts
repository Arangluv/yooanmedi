export const ORDER_PRODUCT_STATUS = {
  PENDING: 'pending', // 입금확인
  PREPARING: 'preparing', // 상품준비
  SHIPPING: 'shipping', // 배송시작
  DELIVERED: 'delivered', // 배송완료
  CANCEL_REQUEST: 'cancel_request', // 취소 요청
  CANCELLED: 'cancelled', // 주문취소
} as const;

export const ORDER_PRODUCT_STATUS_NAME = {
  [ORDER_PRODUCT_STATUS.PENDING]: '입금확인중',
  [ORDER_PRODUCT_STATUS.PREPARING]: '상품준비',
  [ORDER_PRODUCT_STATUS.SHIPPING]: '배송시작',
  [ORDER_PRODUCT_STATUS.DELIVERED]: '배송완료',
  [ORDER_PRODUCT_STATUS.CANCEL_REQUEST]: '취소요청',
  [ORDER_PRODUCT_STATUS.CANCELLED]: '주문취소',
} as const;
