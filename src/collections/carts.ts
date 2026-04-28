import { CollectionConfig } from 'payload';

export const Carts: CollectionConfig = {
  slug: 'carts',
  labels: {
    singular: '장바구니',
    plural: '장바구니',
  },
  lockDocuments: false,
  admin: {
    group: '유저 관리',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: '유저',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'cart-items',
      hasMany: true,
    },
  ],
};
