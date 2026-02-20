/**
 * @description 주문 상태
 * @property PENDING - 입금확인중
 * @property PREPARING - 상품준비
 * @property SHIPPING - 배송시작
 * @property DELIVERED - 배송완료
 * @property CANCEL_REQUEST - 취소 요청
 * @property CANCELLED - 주문 취소
 */
export const ORDER_STATUS = {
  PENDING: 'pending', // 입금확인중
  PREPARING: 'preparing', // 상품준비
  SHIPPING: 'shipping', // 배송시작
  DELIVERED: 'delivered', // 배송완료
  CANCEL_REQUEST: 'cancel_request', // 취소 요청
  CANCELLED: 'cancelled', // 주문취소
} as const;

export const ORDER_STATUS_NAME = {
  [ORDER_STATUS.PENDING]: '입금확인중',
  [ORDER_STATUS.PREPARING]: '상품준비',
  [ORDER_STATUS.SHIPPING]: '배송시작',
  [ORDER_STATUS.DELIVERED]: '배송완료',
  [ORDER_STATUS.CANCEL_REQUEST]: '취소 요청',
  [ORDER_STATUS.CANCELLED]: '주문 취소',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type OrderStatusKey = keyof typeof ORDER_STATUS;
