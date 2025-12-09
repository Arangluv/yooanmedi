import { CollectionConfig } from 'payload'

export const OrderStatus: CollectionConfig = {
  slug: 'order-status',
  labels: {
    singular: '주문 상태',
    plural: '주문 상태',
  },
  admin: {
    group: '홈페이지 컨텐츠',
    useAsTitle: 'name',
    defaultColumns: ['name', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '주문상태명',
      required: true,
    },
  ],
}
