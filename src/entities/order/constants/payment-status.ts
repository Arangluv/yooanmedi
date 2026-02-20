export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  PARTIAL_CANCEL: 'PARTIAL_CANCEL',
  TOTAL_CANCEL: 'TOTAL_CANCEL',
} as const;

export const PAYMENT_STATUS_NAME = {
  [PAYMENT_STATUS.PENDING]: '결제대기',
  [PAYMENT_STATUS.COMPLETE]: '결제완료',
  [PAYMENT_STATUS.PARTIAL_CANCEL]: '부분취소',
  [PAYMENT_STATUS.TOTAL_CANCEL]: '전체취소',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type PaymentStatusKey = keyof typeof PAYMENT_STATUS;
