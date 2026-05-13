import { CollectionConfig } from 'payload';

import { ORDER_PRODUCT_STATUS, ORDER_PRODUCT_STATUS_NAME } from '@/entities/order-product';

export const OrderProduct: CollectionConfig = {
  slug: 'order-product',
  labels: {
    singular: '고객 주문 상품',
    plural: '고객 주문 상품',
  },
  lockDocuments: false,
  admin: {
    defaultColumns: [
      'productNameSnapshot',
      'priceSnapshot',
      'totalAmount',
      'productDeliveryFee',
      'quantity',
      'totalAmount',
    ],
    useAsTitle: 'productNameSnapshot',
    group: '주문 관리',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      label: '주문상품',
      relationTo: 'product',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'order',
      type: 'relationship',
      label: '주문',
      relationTo: 'order',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'orderProductStatus',
      type: 'select',
      label: '주문 상태',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      options: [
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.pending],
          value: ORDER_PRODUCT_STATUS.pending,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.preparing],
          value: ORDER_PRODUCT_STATUS.preparing,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.shipping],
          value: ORDER_PRODUCT_STATUS.shipping,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.delivered],
          value: ORDER_PRODUCT_STATUS.delivered,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.cancel_request],
          value: ORDER_PRODUCT_STATUS.cancel_request,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.cancelled],
          value: ORDER_PRODUCT_STATUS.cancelled,
        },
      ],
    },
    {
      name: 'productNameSnapshot',
      type: 'text',
      label: '상품 이름',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'priceSnapshot',
      type: 'number',
      label: '상품 금액',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      required: true,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '가격을 입력해주세요';
        }
        if (value < 0) {
          return '가격은 0 이상이어야 합니다.';
        }
        return true;
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: '상품 결제금액',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      required: true,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '상품 결제금액을 입력해주세요';
        }
        if (value < 0) {
          return '상품 결제금액은 0 이상이어야 합니다.';
        }
        return true;
      },
    },
    {
      name: 'productDeliveryFee',
      type: 'number',
      label: '상품 배송비',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '배송비를 입력해주세요';
        }

        if (value < 0) {
          return '배송비는 0 이상이어야 합니다.';
        }
        return true;
      },
    },
    {
      name: 'quantity',
      type: 'number',
      label: '수량',
      required: true,
      defaultValue: 1,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true;
        }
        if (value < 1) {
          return '수량은 1 이상이어야 합니다.';
        }
        return true;
      },
    },
    {
      name: 'cashback_rate',
      type: 'number',
      label: '카드 적립금 비율',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '카드 적립금 비율을 입력해주세요';
        }
        if (value < 0) {
          return '카드 적립금 비율은 0 이상이어야 합니다.';
        }
        return true;
      },
    },
    {
      name: 'cashback_rate_for_bank',
      type: 'number',
      label: '무통장 입금 적립금 비율',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '무통장 입금 적립금 비율을 입력해주세요';
        }
        if (value < 0) {
          return '무통장 입금 적립금 비율은 0 이상이어야 합니다.';
        }
        return true;
      },
    },
  ],
};
