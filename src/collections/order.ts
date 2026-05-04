import { CollectionConfig } from 'payload';

import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-method';
import { FLG_STATUS, FLG_STATUS_NAME } from '@/entities/order/constants/flg-status';
import { PAYMENT_STATUS, PAYMENT_STATUS_NAME } from '@/entities/order/constants/payment-status';

export const Order: CollectionConfig = {
  slug: 'order',
  labels: {
    singular: '주문 내역',
    plural: '주문 내역',
  },
  lockDocuments: false,
  admin: {
    group: '주문 관리',
    useAsTitle: 'orderNo',
    defaultColumns: [
      'orderNo',
      'user',
      'orderStatus',
      'paymentStatus',
      'createdAt',
      'flgStatus',
      'finalPrice',
      'paymentsMethod',
    ],
    components: {
      views: {
        edit: {
          default: {
            Component: '@/features/admin/order-detail/ui/CollectionView',
          },
        },
        list: {
          Component: '@/features/admin/order-list/ui/ListView',
        },
      },
    },
  },
  access: {
    create: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '상호명',
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
          value: PAYMENTS_METHOD.credit_card,
        },
        {
          label: '무통장입금',
          value: PAYMENTS_METHOD.bank_transfer,
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
          label: ORDER_STATUS_NAME[ORDER_STATUS.pending],
          value: ORDER_STATUS.pending,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.preparing],
          value: ORDER_STATUS.preparing,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.shipping],
          value: ORDER_STATUS.shipping,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.delivered],
          value: ORDER_STATUS.delivered,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.cancel_request],
          value: ORDER_STATUS.cancel_request,
        },
        {
          label: ORDER_STATUS_NAME[ORDER_STATUS.cancelled],
          value: ORDER_STATUS.cancelled,
        },
      ],
      defaultValue: ORDER_STATUS.pending,
    },
    {
      name: 'flgStatus',
      label: '처리상태',
      type: 'select',
      required: true,
      options: [
        {
          label: FLG_STATUS_NAME[FLG_STATUS.init_normal],
          value: FLG_STATUS.init_normal,
        },
        {
          label: FLG_STATUS_NAME[FLG_STATUS.need_process],
          value: FLG_STATUS.need_process,
        },
        {
          label: FLG_STATUS_NAME[FLG_STATUS.complete],
          value: FLG_STATUS.complete,
        },
      ],
    },
    {
      name: 'paymentStatus',
      label: '결제상태',
      type: 'select',
      required: true,
      options: [
        {
          label: PAYMENT_STATUS_NAME[PAYMENT_STATUS.pending],
          value: PAYMENT_STATUS.pending,
        },
        {
          label: PAYMENT_STATUS_NAME[PAYMENT_STATUS.complete],
          value: PAYMENT_STATUS.complete,
        },
        {
          label: PAYMENT_STATUS_NAME[PAYMENT_STATUS.partial_cancel],
          value: PAYMENT_STATUS.partial_cancel,
        },
        {
          label: PAYMENT_STATUS_NAME[PAYMENT_STATUS.total_cancel],
          value: PAYMENT_STATUS.total_cancel,
        },
      ],
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
