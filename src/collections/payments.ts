import { CollectionConfig } from 'payload';

import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-method';

export const Payments: CollectionConfig = {
  slug: 'payment',
  labels: {
    singular: '카드 결제 내역',
    plural: '카드 결제 내역',
  },
  lockDocuments: false,
  admin: {
    group: '주문 관리',
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      label: '주문',
      relationTo: 'order',
      required: true,
    },
    {
      name: 'pgCno',
      type: 'text',
      label: 'PG 주문번호',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: '승인 금액',
      required: true,
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
      ],
      defaultValue: PAYMENTS_METHOD.credit_card,
      required: true,
    },
  ],
};
