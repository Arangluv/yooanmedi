import { CollectionConfig } from 'payload'

export const PointHistory: CollectionConfig = {
  slug: 'point-history',
  labels: {
    singular: '적립금 내역',
    plural: '적립금 내역',
  },
  admin: {
    group: '홈페이지 컨텐츠',
  },
  fields: [
    {
      type: 'relationship',
      name: 'user',
      label: '유저',
      relationTo: 'users',
      required: true,
    },
    {
      type: 'select',
      name: 'type',
      label: '타입',
      options: [
        {
          label: '적립',
          value: 'earn',
        },
        {
          label: '차감',
          value: 'use',
        },
        {
          label: '취소',
          value: 'cancel',
        },
      ],
      required: true,
    },
    {
      name: 'balanceAfter',
      type: 'number',
      label: '변경 후 잔액',
      admin: { readOnly: true },
    },
    {
      name: 'reason',
      type: 'text',
      required: true,
      label: '사유 (예: 주문 #1234 적립)',
    },
  ],
}
