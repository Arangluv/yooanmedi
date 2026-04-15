export const EASYPAY_CONFIG = {
  clientTypeCode: '00', // 고정
  payMethodTypeCode: '11', // 고정
  currency: '00', // 고정
  deviceTypeCode: 'pc', // 고정
  returnUrl: process.env.NEXT_PUBLIC_SITE_URL + '/api/payments', // 고정
  successResponseCode: '0000',
} as const;
