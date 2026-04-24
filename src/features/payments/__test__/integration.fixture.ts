export const TEST_USER_ID = 24;

const orderList = [
  {
    product: {
      id: 1656,
      image: null,
      name: '훼로맥스액',
      insurance_code: '643503993',
      specification: '5mL/30P',
      manufacturer: '한미약품(주)',
      stock: 999,
      returnable: false,
      price: 8400,
      cashback_rate: 0,
      cashback_rate_for_bank: 0,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
    },
    quantity: 1,
  },
  {
    product: {
      id: 1654,
      image: null,
      name: '하노마린350연질캡슐',
      insurance_code: '655604840',
      specification: '60C',
      manufacturer: '한올바이오파마(주)',
      stock: 999,
      returnable: false,
      price: 24060,
      cashback_rate: 0,
      cashback_rate_for_bank: 0,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
    },
    quantity: 3,
  },
  {
    product: {
      id: 1658,
      image: null,
      name: '타나민정',
      insurance_code: '644501120',
      specification: '40mg/100정',
      manufacturer: '유유제약',
      stock: 999,
      returnable: false,
      price: 2000,
      cashback_rate: 0,
      cashback_rate_for_bank: 0,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
    },
    quantity: 3,
  },
];

export const requestDto = {
  deliveryRequest: '배송 요청사항입니다',
  orderList: orderList,
  usedPoint: 2663,
  userId: TEST_USER_ID,
  minOrderPrice: 30000,
  amount: 83917,
};

export const successCases = [
  {
    caseName: 'UsedPoint === 0',
    requestDto: {
      deliveryRequest: '배송 요청사항입니다',
      orderList: orderList,
      usedPoint: 0,
      userId: TEST_USER_ID,
      minOrderPrice: 30000,
      amount: 86580,
    },
  },
  {
    caseName: 'UsedPoint < Amount',
    requestDto: {
      deliveryRequest: '배송 요청사항입니다',
      orderList: orderList,
      usedPoint: 2663,
      userId: TEST_USER_ID,
      minOrderPrice: 30000,
      amount: 83917,
    },
  },
  {
    caseName: 'UsedPoint === Amount',
    requestDto: {
      deliveryRequest: '배송 요청사항입니다',
      orderList: orderList,
      usedPoint: 86580,
      userId: TEST_USER_ID,
      minOrderPrice: 30000,
      amount: 0,
    },
  },
];

const orderListForPG = [
  { product: { id: 1654, price: 24060 }, quantity: 2 },
  { product: { id: 1655, price: 2000 }, quantity: 3 },
  { product: { id: 1656, price: 8400 }, quantity: 1 },
];
// API Router 지점부터 테스트
const basePGRequestFormData = new FormData();
basePGRequestFormData.append('resCd', '0000');
basePGRequestFormData.append('resMsg', '정상');
basePGRequestFormData.append('authorizationId', '26042414465310904317');
basePGRequestFormData.append('shopValue1', '');
basePGRequestFormData.append(
  'shopValue2',
  '[{"product":{"id":1654,"price":24060},"quantity":2},{"product":{"id":1655,"price":2000},"quantity":3},{"product":{"id":1656,"price":8400},"quantity":1}]',
);
// basePGRequestFormData.append('shopValue3', '0');
basePGRequestFormData.append('shopValue4', `${TEST_USER_ID}`);
basePGRequestFormData.append('shopValue5', 'creditCard');
basePGRequestFormData.append('shopValue6', '30000');

const BASE_APPROVAL_RESULT = {
  resCd: '0000',
  resMsg: 'MPI결제 정상',
  isPaymentApprovalSuccess: true,
  mallId: '********',
  pgCno: '********274910904459',
  shopOrderNo: '202604246803877',
  shopTransactionId: '**********C44B78BED4F3AB18F8D7DB',
  statusCode: 'TS03',
  statusMessage: '매입요청',
  msgAuthValue: '**',
  escrowUsed: 'N',
  transactionDate: '2026-04-24T06:28:13.000Z',
  paymentInfo: {
    payMethodTypeCode: '11',
    approvalNo: '16357139',
    approvalDate: '2026-04-24T06:28:13.000Z',
  },
} as const;

export const createEasypayApprovalResponse = (amount: number) => {
  return {
    ...BASE_APPROVAL_RESULT,
    amount,
  };
};

export const PGCases = [
  {
    caseName: 'UsedPoint === 0',
    amount: 62520,
    userId: TEST_USER_ID,
    usedPoint: 0,
    orderList: orderListForPG,
    getRequestDto: () => {
      basePGRequestFormData.append('shopValue3', '0');
      return basePGRequestFormData;
    },
  },
  {
    caseName: 'UsedPoint < Amount',
    amount: 13536,
    userId: TEST_USER_ID,
    usedPoint: 48984,
    orderList: orderListForPG,
    getRequestDto: () => {
      basePGRequestFormData.append('shopValue3', '48984');
      return basePGRequestFormData;
    },
  },
  {
    caseName: 'UsedPoint === Amount',
    amount: 0,
    userId: TEST_USER_ID,
    usedPoint: 62520,
    orderList: orderListForPG,
    getRequestDto: () => {
      basePGRequestFormData.append('shopValue3', '62520');
      return basePGRequestFormData;
    },
  },
];
