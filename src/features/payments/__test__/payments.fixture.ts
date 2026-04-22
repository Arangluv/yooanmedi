import { shopOrderNoFixture } from '@/shared/__mock__/base.fixture';
import { createProductFixture } from '@/shared/__mock__/product.fixture';

export const bankTransferRequestDtoFixture = {
  deliveryRequest: '배송요청사항입니다',
  orderList: [
    {
      product: {
        id: 1684,
        image: null,
        name: '아스피린프로텍트정100mg',
        insurance_code: '641100270',
        specification: '98T',
        manufacturer: '바이엘코리아',
        stock: 999,
        returnable: false,
        price: 2000,
        cashback_rate: 0.5,
        cashback_rate_for_bank: 1.5,
        delivery_fee: 0,
        is_cost_per_unit: false,
        is_free_delivery: false,
      },
      quantity: 2,
    },
    {
      product: {
        id: 1683,
        image: null,
        name: '부로멜라장용정',
        insurance_code: '649801890',
        specification: '100mg/300T',
        manufacturer: '(사용X)명문제약',
        stock: 999,
        returnable: false,
        price: 2000,
        cashback_rate: 0.5,
        cashback_rate_for_bank: 1.5,
        delivery_fee: 0,
        is_cost_per_unit: false,
        is_free_delivery: false,
      },
      quantity: 3,
    },
    {
      product: {
        id: 1681,
        image: null,
        name: '소부날캡슐200mg',
        insurance_code: '650300780',
        specification: '100C',
        manufacturer: '진양제약',
        stock: 999,
        returnable: false,
        price: 2000,
        cashback_rate: 0.5,
        cashback_rate_for_bank: 1.5,
        delivery_fee: 0,
        is_cost_per_unit: false,
        is_free_delivery: false,
      },
      quantity: 3,
    },
    {
      product: {
        id: 1680,
        image: {
          id: 196,
          updatedAt: '2026-01-07T05:33:20.983Z',
          createdAt: '2026-01-07T05:33:20.507Z',
          url: '/api/image/file/-1ml-50a-1767764000584.webp',
          thumbnailURL: null,
          filename: '-1ml-50a-1767764000584.webp',
          mimeType: 'image/webp',
          filesize: 34136,
          width: 249,
          height: 335,
          focalX: 50,
          focalY: 50,
        },
        name: '칼트레이트디400',
        insurance_code: '051600350',
        specification: '30정',
        manufacturer: '헤일리온코리아 주식회사',
        stock: 999,
        returnable: false,
        price: 2000,
        cashback_rate: 0.5,
        cashback_rate_for_bank: 1.5,
        delivery_fee: 0,
        is_cost_per_unit: false,
        is_free_delivery: false,
      },
      quantity: 2,
    },
  ],
  usedPoint: 0,
  userId: 3,
  minOrderPrice: 30000,
  amount: 20000,
};

export const createPGRequestDtoFixture = () => {
  const formData = new FormData();
  formData.append('resCd', '0000');
  formData.append('resMsg', '정상');
  formData.append('shopOrderNo', '202604226761924');
  formData.append('authorizationId', '26042210595810898910');
  formData.append('shopValue1', '');
  formData.append(
    'shopValue2',
    '[{"product":{"id":1684,"price":2000},"quantity":3},{"product":{"id":1683,"price":2000},"quantity":5},{"product":{"id":1681,"price":2000},"quantity":4},{"product":{"id":1682,"price":2000},"quantity":3}]',
  );
  formData.append('shopValue3', '8000');
  formData.append('shopValue4', '3');
  formData.append('shopValue5', 'creditCard');
  formData.append('shopValue6', '30000');

  return formData;
};

export const basePaymentContextFixture = {
  shopOrderNo: shopOrderNoFixture,
  userId: 1,
  usedPoint: 3000,
  minOrderPrice: 30000,
  orderList: [
    {
      product: createProductFixture({
        id: 1,
      }),
      quantity: 3,
    },
    {
      product: createProductFixture({
        id: 2,
      }),
      quantity: 1,
    },
  ],
  deliveryRequest: '',
};

export const enrichedOrderListFixture = [
  {
    product: createProductFixture({
      id: 1,
    }),
    quantity: 3,
    totalAmount: 1665,
    orderProductDeliveryFee: 0,
    calculatedUsedPoint: 595,
  },
  {
    product: createProductFixture({
      id: 2,
    }),
    quantity: 2,
    totalAmount: 2333,
    orderProductDeliveryFee: 0,
    calculatedUsedPoint: 0,
  },
];
