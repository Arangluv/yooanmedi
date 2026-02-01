import { CollectionConfig } from 'payload';

export const ProductPrice: CollectionConfig = {
  slug: 'product-price',
  labels: {
    singular: '제품 가격',
    plural: '제품 가격',
  },
  admin: {
    useAsTitle: 'id',
    // hidden: true,
  },
  indexes: [
    {
      fields: ['product', 'user'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'product',
      type: 'relationship',
      label: '제품',
      relationTo: 'product',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      label: '유저',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      defaultValue: 0,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return '제품 가격을 입력해주세요';
        }
        if (value < 0) {
          return '가격은 0 이상이어야 합니다.';
        }
        return true;
      },
    },
  ],
};
