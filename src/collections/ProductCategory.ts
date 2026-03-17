import { CollectionConfig } from 'payload';

export const ProductCategory: CollectionConfig = {
  slug: 'product-category',
  labels: {
    singular: '상품 카테고리',
    plural: '상품 카테고리',
  },
  lockDocuments: false,
  admin: {
    group: '상품 관리',
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
};
