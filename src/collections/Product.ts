import { CollectionConfig, CustomComponent, EditConfig } from 'payload'

export const Product: CollectionConfig = {
  slug: 'product',
  labels: {
    singular: '제품',
    plural: '제품',
  },
  admin: {
    group: '홈페이지 컨텐츠',
    defaultColumns: ['name', 'category', 'price', 'is_best_product'],
    useAsTitle: 'name',
    components: {
      beforeListTable: ['@collections/components/product/ProductListTest'] as CustomComponent[],
    },
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      label: '제품이미지',
      relationTo: 'image',
    },
    {
      name: 'name',
      type: 'text',
      label: '상품명',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      label: '카테고리',
      relationTo: 'product-category',
    },
    {
      name: 'insurance_code',
      type: 'text',
      label: '보험코드',
    },
    {
      name: 'manufacturer',
      type: 'text',
      label: '제조사',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      label: '가격',
      defaultValue: 0,
      required: true,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true
        }

        if (value < 0) {
          return '가격은 0 이상이어야 합니다.'
        }
        return true
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'cashback_rate',
          type: 'number',
          label: '카드결제 적립금 비율',
          admin: {
            description: `카드 결제 적립금 비율을 퍼센트로 입력해주세요 (ex: 1.5) \n최대 1.8까지 입력 가능합니다.`,
          },
          defaultValue: 0,
          required: true,
          validate: (value: number | null | undefined) => {
            if (value === null || value === undefined) {
              return true
            }

            if (value < 0) {
              return '적립금 비율은 0 이상이어야 합니다.'
            }
            if (value > 1.8) {
              return '적립금 비율은 1.8 이하이어야 합니다.'
            }
            return true
          },
        },
        {
          name: 'cashback_rate_for_bank',
          type: 'number',
          label: '무통장 입금 적립금 비율',
          admin: {
            description:
              '무통장 입금 적립금 비율을 퍼센트로 입력해주세요 (ex: 1.5) \n최대 1.8까지 입력 가능합니다.',
          },
          defaultValue: 0,
          validate: (value: number | null | undefined) => {
            if (value === null || value === undefined) {
              return true
            }

            if (value < 0) {
              return '적립금 비율은 0 이상이어야 합니다.'
            }
            if (value > 1.8) {
              return '적립금 비율은 1.8 이하이어야 합니다.'
            }
            return true
          },
          required: true,
        },
      ],
    },
    {
      name: 'specification',
      type: 'text',
      label: '규격/단위',
    },
    {
      name: 'stock',
      type: 'number',
      label: '재고',
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true
        }

        if (value < 0) {
          return '재고는 0 이상이어야 합니다.'
        }
        return true
      },
      required: true,
    },
    {
      name: 'delivery_fee',
      type: 'number',
      label: '배송비',
      defaultValue: 0,
      required: true,
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true
        }

        if (value < 0) {
          return '배송비는 0 이상이어야 합니다.'
        }
        return true
      },
    },
    {
      name: 'returnable',
      type: 'checkbox',
      label: '반품가능여부',
      required: true,
      defaultValue: false,
      admin: {
        description: '반품가능여부를 선택해주세요 (체크 시 반품가능)',
      },
    },
    {
      name: 'is_best_product',
      type: 'checkbox',
      label: '인기 제품 여부',
      required: true,
      defaultValue: false,
      admin: {
        description: '인기 제품 여부를 선택해주세요 (체크 시 인기 제품)',
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (!doc.is_best_product) {
          return {
            ...doc,
            is_best_product: false,
          }
        }
        return {
          ...doc,
          is_best_product: true,
        }
      },
    ],
  },
}
