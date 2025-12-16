import { CollectionConfig } from 'payload'

export const PointForTransation: CollectionConfig = {
  slug: 'point-for-transation',
  labels: {
    singular: '환불 포인트 관리',
    plural: '환불 포인트 관리',
  },
  admin: {
    group: '홈페이지 컨텐츠',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '유저',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'usedPointAmount',
      type: 'number',
      label: '사용 적립금',
      required: true,
    },
    {
      name: 'transactionPgCno',
      type: 'text',
      label: '거래 번호',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
