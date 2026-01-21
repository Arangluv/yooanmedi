import { CollectionConfig, CustomComponent } from 'payload'

export const Product: CollectionConfig = {
  slug: 'product',
  labels: {
    singular: '제품',
    plural: '제품',
  },
  lockDocuments: false,
  admin: {
    group: '홈페이지 컨텐츠',
    defaultColumns: ['manufacturer', 'name', 'category', 'price', 'is_best_product', 'stock'],
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
          return '가격을 입력해주세요'
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
              return '카드 결제 적립금 비율을 입력해주세요'
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
              return '무통장 입금 적립금 비율을 입력해주세요'
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
          return '재고를 입력해주세요'
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
          return '배송비를 입력해주세요'
        }

        if (value < 0) {
          return '배송비는 0 이상이어야 합니다.'
        }
        return true
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "is_cost_per_unit",
          type: "checkbox",
          label: "수량 당 배송비 계산 여부",
          defaultValue: false,
          admin: {
            width: '50%',
            description: "수량 당 배송비 계산 여부를 선택해주세요 (체크 시 수량 당 배송비 계산)",
          },
        },
        {
          name: "is_free_delivery",
          type: "checkbox",
          label: "최소 주문 금액 이상 시 배송비 무료 여부",
          defaultValue: false,
          admin: {
            width: '50%',
            description: "최소 주문 금액 이상 시 배송비 무료 여부를 선택해주세요 (체크 시 최소 주문 금액 이상 시 배송비 무료)",
          },
        },
      ]
    },
    {
      type: "row",
      fields: [
        {
          name: 'returnable',
          type: 'checkbox',
          label: '반품가능여부',
          defaultValue: false,
          admin: {
            width: '50%',
            description: '반품가능여부를 선택해주세요 (체크 시 반품가능)',
          },
        },
        {
          name: 'is_best_product',
          type: 'checkbox',
          label: '인기 제품 여부',
          defaultValue: false,
          admin: {
            width: '50%',
            description: `인기 제품 여부를 선택해주세요 (체크 시 주문 페이지 상단에 표시됩니다.)`,
            components: {
              Cell: '@/collections/components/product/BestProductCell',
            },
          },
        },
      ]
    }
  ],
}
