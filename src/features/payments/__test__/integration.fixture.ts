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
  userId: 24,
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
      userId: 24,
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
      userId: 24,
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
      userId: 24,
      minOrderPrice: 30000,
      amount: 0,
    },
  },
];
