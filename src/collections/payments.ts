import { CollectionConfig } from 'payload';

import { PAYMENTS_METHOD } from '@/entities/order';

export const Payments: CollectionConfig = {
  slug: 'payment',
  labels: {
    singular: '결제 내역',
    plural: '결제 내역',
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
      name: 'pg_cno',
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
      name: 'payments_method',
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
      ],
      defaultValue: PAYMENTS_METHOD.CREDIT_CARD,
      required: true,
    },
  ],
};
