import { CollectionConfig } from 'payload';

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  labels: {
    singular: '관심상품',
    plural: '관심상품',
  },
  lockDocuments: false,
  admin: {
    group: '유저 관리',
    defaultColumns: ['user', 'product', 'createdAt'],
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
  ],
};
