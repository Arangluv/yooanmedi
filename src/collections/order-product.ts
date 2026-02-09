import { CollectionConfig } from 'payload';

import { ITEM_STATUS, ITEM_STATUS_NAME } from '@/entities/order';

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
      name: 'order_item_status',
      type: 'select',
      label: '주문 상태',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      options: [
        {
          label: ITEM_STATUS_NAME[ITEM_STATUS.ORDERED],
          value: ITEM_STATUS.ORDERED,
        },
        {
          label: ITEM_STATUS_NAME[ITEM_STATUS.CANCELLED],
          value: ITEM_STATUS.CANCELLED,
        },
        {
          label: ITEM_STATUS_NAME[ITEM_STATUS.REFUNDED],
          value: ITEM_STATUS.REFUNDED,
        },
      ],
      defaultValue: ITEM_STATUS.ORDERED,
    },
    {
      name: 'price_snapshot',
      type: 'number',
      label: '주문 시 상품 금액',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      defaultValue: 0,
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
      name: 'product_delivery_fee',
      type: 'number',
      label: '상품 배송비',
      defaultValue: 0,
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
      label: '주문 시 카드결제 적립금 비율',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      defaultValue: 0,
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
      name: 'cashback_rate_for_bank',
      type: 'number',
      label: '주문 시 무통장 입금 적립금 비율',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      defaultValue: 0,
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
