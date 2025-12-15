import { CollectionConfig } from 'payload'

export const Order: CollectionConfig = {
  slug: 'order',
  labels: {
    singular: '주문 내역',
    plural: '주문 내역',
  },
  access: {
    delete: () => false,
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
      name: 'product',
      type: 'relationship',
      label: '상품',
      relationTo: 'product',
      required: true,
    },
    {
      name: 'orderCreatedAt',
      type: 'date',
      label: '주문일시',
      required: true,
    },
    // 추후 msgAuthValue 만들때 pgCno와 랜덤으로 만든 transactionId를 해시해서 넘겨야함
    // https://developer.easypay.co.kr/change-inquiry/cancellationRequest 해당페이지 각주 확인
    {
      name: 'pgCno',
      type: 'text',
      label: 'PG 주문번호',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      label: '수량',
      required: true,
      defaultValue: 1,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true
        }
        if (value < 1) {
          return '수량은 1 이상이어야 합니다.'
        }
        return true
      },
    },
    {
      name: 'orderStatus',
      type: 'relationship',
      label: '주문상태',
      relationTo: 'order-status',
      required: true,
    },
    {
      name: 'orderRequest',
      type: 'text',
      label: '주문요청사항',
    },
  ],
}
