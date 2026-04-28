import { CollectionConfig } from 'payload';

export const CartItems: CollectionConfig = {
  slug: 'cart-items',
  labels: {
    singular: '장바구니 아이템',
    plural: '장바구니 아이템',
  },
  lockDocuments: false,
  admin: {
    group: '유저 관리',
  },
  fields: [
    {
      name: 'carts',
      type: 'relationship',
      relationTo: 'carts',
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
      name: 'quantity',
      type: 'number',
      label: '수량',
      required: true,
    },
  ],
};
