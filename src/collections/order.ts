import { CollectionConfig } from 'payload';

import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';

export const Order: CollectionConfig = {
  slug: 'order',
  labels: {
    singular: '주문 내역',
    plural: '주문 내역',
  },
  admin: {
    group: '주문 관리',
    useAsTitle: 'orderNo',
    defaultColumns: [
      'user',
      'paymentsMethod',
      'orderStatus',
      'orderRequest',
      'orderNo',
      'finalPrice',
    ],
  },
  access: {
    create: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '주문고객',
      relationTo: 'users',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'orderProducts',
      type: 'join',
      label: '주문 상품 목록',
      collection: 'order-product',
      on: 'order',
      maxDepth: 3,
    },
    {
      name: 'paymentsMethod',
      type: 'select',
      label: '결제 방법',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      options: [
        {
          label: '신용카드',
          value: PAYMENTS_METHOD.CREDIT_CARD,
        },
        {
          label: '무통장입금',
          value: PAYMENTS_METHOD.BANK_TRANSFER,
        },
      ],
      required: true,
    },
    {
      name: 'orderStatus',
      type: 'select',
      label: '주문상태',
      required: true,
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      options: [
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.PREPARING],
          value: ORDER_STATUS.PREPARING,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.SHIPPING],
          value: ORDER_STATUS.SHIPPING,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.DELIVERED],
          value: ORDER_STATUS.DELIVERED,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.CANCELLED],
          value: ORDER_STATUS.CANCELLED,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.PENDING],
          value: ORDER_STATUS.PENDING,
        },
      ],
      defaultValue: ORDER_STATUS.PENDING,
    },
    {
      name: 'orderDeliveryFee',
      type: 'number',
      label: '주문 배송비',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      defaultValue: 0,
    },
    {
      name: 'orderRequest',
      type: 'text',
      label: '배송 요청사항',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
    },
    {
      name: 'orderNo',
      type: 'text',
      label: '주문번호',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'finalPrice',
      type: 'number',
      label: '최종 주문 금액',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      defaultValue: 0,
      required: true,
    },
    {
      name: 'usedPoint',
      type: 'number',
      label: '사용 포인트',
      admin: {
        disableBulkEdit: true,
        readOnly: true,
      },
      defaultValue: 0,
      required: true,
    },
  ],
};
