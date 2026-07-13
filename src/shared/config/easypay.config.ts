export const EASYPAY_CONFIG = {
  clientTypeCode: '00',
  payMethodTypeCode: '11',
  currency: '00',
  deviceTypeCode: 'pc',
  returnUrl: process.env.SITE_URL + '/api/payments',
  successResponseCode: '0000',
  cancelReviseType: {
    partial: '32',
    total: '40',
  },
} as const;
