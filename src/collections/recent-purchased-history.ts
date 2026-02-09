import { CollectionConfig } from 'payload';

export const RecentPurchasedHistory: CollectionConfig = {
  slug: 'recent-purchased-history',
  labels: {
    singular: '상품 구매내역',
    plural: '상품 구매내역',
  },
  admin: {
    defaultColumns: ['user', 'product', 'quantity', 'amount'],
    group: '홈페이지 컨텐츠',
    useAsTitle: 'id',
  },
  access: {
    create: () => false,
    delete: () => false,
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
      name: 'quantity',
      type: 'number',
      label: '수량',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: '구매 금액',
      required: true,
    },
  ],
};
