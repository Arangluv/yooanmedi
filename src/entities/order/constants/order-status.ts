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
  pending: 'pending', // 입금확인중
  preparing: 'preparing', // 상품준비
  shipping: 'shipping', // 배송시작
  delivered: 'delivered', // 배송완료
  cancel_request: 'cancel_request', // 취소 요청
  cancelled: 'cancelled', // 주문취소
} as const;

export const ORDER_STATUS_NAME = {
  [ORDER_STATUS.pending]: '입금확인중',
  [ORDER_STATUS.preparing]: '상품준비',
  [ORDER_STATUS.shipping]: '배송시작',
  [ORDER_STATUS.delivered]: '배송완료',
  [ORDER_STATUS.cancel_request]: '취소요청',
  [ORDER_STATUS.cancelled]: '주문취소',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type OrderStatusKey = keyof typeof ORDER_STATUS;
