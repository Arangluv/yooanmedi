import { CollectionConfig } from 'payload';

export const PointTransaction: CollectionConfig = {
  slug: 'point-transaction',
  labels: {
    singular: '적립금 내역',
    plural: '적립금 내역',
  },
  lockDocuments: false,
  admin: {
    defaultColumns: ['user', 'type', 'amount', 'createdAt'],
    group: '주문 관리',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '유저',
      relationTo: 'users',
    },
    {
      name: 'orderProduct',
      type: 'relationship',
      label: '주문 상품',
      relationTo: 'order-product',
    },
    {
      name: 'type',
      type: 'select',
      label: '타입',
      required: true,
      options: [
        {
          label: '사용',
          value: 'USE',
        },
        {
          label: '주문 적립',
          value: 'EARN',
        },
        {
          label: '사용 취소',
          value: 'CANCEL_USE',
        },
        {
          label: '주문 적립 취소',
          value: 'CANCEL_EARN',
        },
      ],
    },
    {
      name: 'reason',
      type: 'text',
      label: '사유',
    },
    {
      name: 'amount',
      type: 'number',
      label: '금액',
      admin: {
        readOnly: true,
      },
      required: true,
    },
  ],
};
