export const PAYMENTS_METHOD = {
  credit_card: 'creditCard',
  bank_transfer: 'bankTransfer',
} as const;

export const PAYMENTS_METHOD_NAME = {
  [PAYMENTS_METHOD.credit_card]: '신용카드',
  [PAYMENTS_METHOD.bank_transfer]: '무통장입금',
} as const;

export type PaymentsMethod = (typeof PAYMENTS_METHOD)[keyof typeof PAYMENTS_METHOD];
export type PaymentsMethodKey = keyof typeof PAYMENTS_METHOD;
