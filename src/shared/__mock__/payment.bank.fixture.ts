import { Inventory } from '@/entities/inventory/model/inventory-schema';

export const baseBankTransferDtoFixture = {
  shopOrderNo: '202604028301240',
  deliveryRequest: '',
  orderList: [
    {
      product: {
        id: 1676,
        price: 2000,
      },
      quantity: 3,
    },
    {
      product: {
        id: 1680,
        price: 2000,
      },
      quantity: 2,
    },
    {
      product: {
        id: 1683,
        price: 2000,
      },
      quantity: 1,
    },
    {
      product: {
        id: 1682,
        price: 2000,
      },
      quantity: 2,
    },
  ],
  usedPoint: 0,
  userId: 3,
  amount: 16000,
  minOrderPrice: 30000,
};

export const basePaymentInventoryFixture: Inventory = [
  {
    product: {
      id: 1676,
      price: 2000,
      image: null,
      name: '넬슨이부프로펜정200mg',
      insurance_code: '656700420',
      specification: '1000T',
      manufacturer: '한국넬슨제약',
      ingredient: 'losartan potassium (as losartan) 91.6mg',
      stock: 999,
      is_best_product: false,
      returnable: false,
      cashback_rate: 0.5,
      cashback_rate_for_bank: 1.5,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
      updatedAt: '2026-02-23T06:36:58.653Z',
      createdAt: '2026-02-14T10:00:24.727Z',
    },
    quantity: 3,
  },
  {
    product: {
      id: 1680,
      price: 2000,
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
      ingredient: 'dexpanthenol 500mg',
      stock: 999,
      is_best_product: true,
      returnable: false,
      cashback_rate: 0.5,
      cashback_rate_for_bank: 1.5,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
      updatedAt: '2026-02-23T06:36:58.652Z',
      createdAt: '2026-02-14T10:00:24.748Z',
    },
    quantity: 2,
  },
  {
    product: {
      id: 1683,
      price: 2000,
      image: null,
      name: '부로멜라장용정',
      insurance_code: '649801890',
      specification: '100mg/300T',
      manufacturer: '(사용X)명문제약',
      ingredient: 'proteolytic peptide from porcine brain 2.152g(0.2152g/mL)',
      stock: 999,
      is_best_product: true,
      returnable: false,
      cashback_rate: 0.5,
      cashback_rate_for_bank: 1.5,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
      updatedAt: '2026-02-23T06:36:58.652Z',
      createdAt: '2026-02-14T10:00:24.752Z',
    },
    quantity: 1,
  },
  {
    product: {
      id: 1682,
      price: 2000,
      image: null,
      name: '엔도콜액 (시메티콘)',
      insurance_code: '659900902',
      specification: '10ml/50포',
      manufacturer: '(사용X)한국팜비오',
      ingredient: 'fursultiamine hydrochloride 54.6mg',
      stock: 999,
      is_best_product: true,
      returnable: false,
      cashback_rate: 0.5,
      cashback_rate_for_bank: 1.5,
      delivery_fee: 0,
      is_cost_per_unit: false,
      is_free_delivery: false,
      updatedAt: '2026-02-23T06:36:58.652Z',
      createdAt: '2026-02-14T10:00:24.752Z',
    },
    quantity: 2,
  },
];

export const createMockBankTransferDto = (
  override?: Partial<typeof baseBankTransferDtoFixture>,
) => {
  return {
    ...baseBankTransferDtoFixture,
    ...override,
  };
};
