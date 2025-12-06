import { CollectionConfig } from 'payload'

export const ProductCategory: CollectionConfig = {
  slug: 'product-category',
  labels: {
    singular: '제품 카테고리',
    plural: '제품 카테고리',
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
      label: '카테고리명',
      required: true,
    },
  ],
}
