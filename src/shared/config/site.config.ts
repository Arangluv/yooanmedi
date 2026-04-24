export const siteConfig = {
  title: '유안메디팜',
  description:
    '의약품 전자상거래 전문업체 주사제 · 백신 · 흡입제 · 내복제 · 외용제 · 기타 · 수액제',
  naverSiteVerification: '9644d1313bdc4eb82c7847c0926a1b838be86b1c',
};

/**
 * 유안메디팜에서 제공하는 결제 방법
 */
export const PAYMENTS_METHOD = {
  CREDIT_CARD: 'creditCard',
  BANK_TRANSFER: 'bankTransfer',
} as const;

export const PAYMENTS_METHOD_NAME = {
  [PAYMENTS_METHOD.CREDIT_CARD]: '신용카드',
  [PAYMENTS_METHOD.BANK_TRANSFER]: '무통장입금',
} as const;

export type PaymentsMethod = (typeof PAYMENTS_METHOD)[keyof typeof PAYMENTS_METHOD];
export type PaymentsMethodKey = keyof typeof PAYMENTS_METHOD;
