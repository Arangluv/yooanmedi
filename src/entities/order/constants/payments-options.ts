export const PAYMENTS_METHOD = {
  CREDIT_CARD: 'creditCard',
  BANK_TRANSFER: 'bankTransfer',
} as const;

export const PAYMENTS_METHOD_NAME = {
  [PAYMENTS_METHOD.CREDIT_CARD]: '신용카드',
  [PAYMENTS_METHOD.BANK_TRANSFER]: '무통장입금',
} as const;
