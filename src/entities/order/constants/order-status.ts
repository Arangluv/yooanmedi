/**
 * @description 주문 상태
 * @property PREPARING - 상품준비
 * @property SHIPPING - 배송시작
 * @property DELIVERED - 배송완료
 * @property CANCELLED - 주문 취소
 * @property PENDING - 결제 대기
 */
export const ORDER_STATUS = {
  PREPARING: 'preparing', // 상품준비
  SHIPPING: 'shipping', // 배송시작
  DELIVERED: 'delivered', // 배송완료
  PARTIAL_CANCELLED: 'partial_cancelled', // 부분 취소
  CANCELLED: 'cancelled', // 주문 취소
  PENDING: 'pending', // 결제 대기
};

export const ORDER_STATUS_NAME = {
  [ORDER_STATUS.PREPARING]: '상품준비',
  [ORDER_STATUS.SHIPPING]: '배송시작',
  [ORDER_STATUS.DELIVERED]: '배송완료',
  [ORDER_STATUS.PARTIAL_CANCELLED]: '부분 취소',
  [ORDER_STATUS.CANCELLED]: '주문 취소',
  [ORDER_STATUS.PENDING]: '결제 대기',
};

export const ITEM_STATUS = {
  ORDERED: 'ordered', // 주문 완료
  CANCELLED: 'cancelled', // 취소 완료
  REFUNDED: 'refunded', // 환불 완료
};

export const ITEM_STATUS_NAME = {
  [ITEM_STATUS.ORDERED]: '주문 완료',
  [ITEM_STATUS.CANCELLED]: '주문 취소',
  [ITEM_STATUS.REFUNDED]: '환불 처리',
};
