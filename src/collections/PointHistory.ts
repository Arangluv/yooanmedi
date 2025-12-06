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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        const payload = req.payload

        // 기존 user 조회
        const user: any = await payload.findByID({
          collection: 'users',
          id: doc.user,
        })

        const prevBalance = user.pointBalance ?? 0
        const newBalance = doc.type === 'earn' ? prevBalance + doc.amount : prevBalance - doc.amount

        // user 업데이트
        await payload.update({
          collection: 'users',
          id: doc.user,
          data: { point: newBalance },
        })

        // history 업데이트 (balanceAfter 저장)
        await payload.update({
          collection: 'point-history',
          id: doc.id,
          data: { balanceAfter: newBalance },
        })
      },
    ],
  },
}
