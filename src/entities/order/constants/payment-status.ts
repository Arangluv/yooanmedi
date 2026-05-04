export const PAYMENT_STATUS = {
  pending: 'PENDING',
  complete: 'COMPLETE',
  partial_cancel: 'PARTIAL_CANCEL',
  total_cancel: 'TOTAL_CANCEL',
} as const;

export const PAYMENT_STATUS_NAME = {
  [PAYMENT_STATUS.pending]: '결제대기',
  [PAYMENT_STATUS.complete]: '결제완료',
  [PAYMENT_STATUS.partial_cancel]: '부분취소',
  [PAYMENT_STATUS.total_cancel]: '전체취소',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type PaymentStatusKey = keyof typeof PAYMENT_STATUS;
