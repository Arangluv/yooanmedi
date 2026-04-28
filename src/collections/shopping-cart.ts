import { CollectionConfig } from 'payload';

export const ShoppingCart: CollectionConfig = {
  slug: 'shopping-cart',
  labels: {
    singular: '장바구니',
    plural: '장바구니',
  },
  lockDocuments: false,
  admin: {
    group: '주문 관리',
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
    },
    {
      name: 'quantity',
      type: 'number',
      label: '수량',
      required: true,
    },
  ],
};
