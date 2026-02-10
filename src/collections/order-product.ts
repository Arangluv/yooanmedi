import { CollectionConfig } from 'payload';

import { ORDER_PRODUCT_STATUS, ORDER_PRODUCT_STATUS_NAME } from '@/entities/order-product';

export const OrderProduct: CollectionConfig = {
  slug: 'order-product',
  labels: {
    singular: '주문 상품',
    plural: '주문 상품',
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
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.CANCELLED],
          value: ORDER_PRODUCT_STATUS.CANCELLED,
        },
        {
          label: ORDER_PRODUCT_STATUS_NAME[ORDER_PRODUCT_STATUS.REFUNDED],
          value: ORDER_PRODUCT_STATUS.REFUNDED,
        },
      ],
    },
    {
      name: 'productNameSnapshot',
      type: 'text',
      label: '주문 시 상품 이름',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'priceSnapshot',
      type: 'number',
      label: '주문 시 상품 금액',
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
      name: 'cashbackRate',
      type: 'number',
      label: '주문 시 카드결제 적립금 비율',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      required: true,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '카드 결제 적립금 비율을 입력해주세요';
        }

        if (value < 0) {
          return '적립금 비율은 0 이상이어야 합니다.';
        }
        if (value > 1.8) {
          return '적립금 비율은 1.8 이하이어야 합니다.';
        }
        return true;
      },
    },
    {
      name: 'cashbackRateForBank',
      type: 'number',
      label: '주문 시 무통장 입금 적립금 비율',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      required: true,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '무통장 입금 적립금 비율을 입력해주세요';
        }

        if (value < 0) {
          return '적립금 비율은 0 이상이어야 합니다.';
        }
        if (value > 1.8) {
          return '적립금 비율은 1.8 이하이어야 합니다.';
        }
        return true;
      },
    },
  ],
};
