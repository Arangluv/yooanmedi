import { CollectionConfig } from 'payload';

import { ORDER_PRODUCT_STATUS, ORDER_PRODUCT_STATUS_NAME } from '@/entities/order-product';

export const OrderProduct: CollectionConfig = {
  slug: 'order-product',
  labels: {
    singular: '고객 주문 상품',
    plural: '고객 주문 상품',
  },
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
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.ORDERED],
          value: ORDER_PRODUCT_STATUS.ORDERED,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.CANCEL_REQUEST],
          value: ORDER_PRODUCT_STATUS.CANCEL_REQUEST,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.CANCELLED],
          value: ORDER_PRODUCT_STATUS.CANCELLED,
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
  ],
};
