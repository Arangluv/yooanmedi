import { CollectionConfig } from 'payload'

export const OrderPackageCompany: CollectionConfig = {
  slug: 'order-pcl',
  labels: {
    singular: '택배사',
    plural: '택배사',
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
      label: '택배사명',
      required: true,
    },
    {
      name: 'InvoiceUrl',
      type: 'text',
      label: '송장조회 URL',
    },
  ],
}
