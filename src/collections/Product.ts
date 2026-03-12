import { CollectionConfig, CustomComponent } from 'payload';

export const Product: CollectionConfig = {
  slug: 'product',
  labels: {
    singular: '상품',
    plural: '상품',
  },
  lockDocuments: false,
  admin: {
    group: '상품 관리',
    defaultColumns: ['manufacturer', 'name', 'category', 'price', 'is_best_product', 'stock'],
    useAsTitle: 'name',
    components: {
      beforeListTable: [
        '@collections/components/product/ProductBulkUploadButton',
      ] as CustomComponent[],
    },
  },
  fields: [
    {
      type: 'ui',
      name: 'separator_line_1',
      admin: {
        custom: {
          text: '제품 정보',
          description: '제품의 기본 정보를 설정할 수 있습니다',
        },
        components: {
          Field: '@/collections/components/common/SeparatorLine',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: '제품이미지',
      relationTo: 'image',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '상품명',
          required: true,
          admin: {
            width: '33.33%',
          },
        },
        {
          name: 'category',
          type: 'relationship',
          label: '카테고리',
          relationTo: 'product-category',
          admin: {
            width: '33.33%',
          },
        },
        {
          name: 'insurance_code',
          type: 'text',
          label: '보험코드',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'specification',
          type: 'text',
          label: '규격/단위',
        },
        {
          name: 'manufacturer',
          type: 'text',
          label: '제조사',
          required: true,
        },
        {
          name: 'ingredient',
          type: 'text',
          label: '성분명',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          label: '재고',
          validate: (value: number | null | undefined) => {
            if (value === null || value === undefined) {
              return '재고를 입력해주세요';
            }

            if (value < 0) {
              return '재고는 0 이상이어야 합니다.';
            }
            return true;
          },
          required: true,
          admin: {
            width: '33.33%',
          },
        },
      ],
    },
    {
      name: 'is_best_product',
      type: 'checkbox',
      label: '인기 제품 여부',
      defaultValue: false,
      admin: {
        description: `인기 제품 여부를 선택해주세요 (체크 시 주문 페이지 상단에 표시됩니다.)`,
        custom: {
          isFirstContent: true,
          isRequireMargin: true,
        },
        components: {
          Cell: '@/collections/components/common/cells/BestProductCell',
          Field: '@/collections/components/common/CustomCheckboxField',
        },
      },
    },
    {
      name: 'returnable',
      type: 'checkbox',
      label: '반품가능여부',
      defaultValue: false,
      required: true,
      admin: {
        description: '반품가능여부를 선택해주세요 (체크 시 반품가능)',
        components: {
          Field: '@/collections/components/common/CustomCheckboxField',
        },
      },
    },
    {
      type: 'ui',
      name: 'separator_margin_1',
      admin: {
        components: {
          Field: '@/collections/components/common/SeparatorMargin',
        },
      },
    },
    {
      type: 'ui',
      name: 'separator_line_2',
      admin: {
        custom: {
          text: '가격 설정',
          description: '제품의 가격 및 적립금 비율을 설정할 수 있습니다',
        },
        components: {
          Field: '@/collections/components/common/SeparatorLine',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: '가격',
          defaultValue: 0,
          required: true,
          admin: {
            width: 'calc(50% - 16px)',
          },
          validate: (value: number | null | undefined) => {
            if (value === null || value === undefined) {
              return '가격을 입력해주세요';
            }

            if (value < 0) {
              return '가격은 0 이상이어야 합니다.';
            }
            return true;
          },
        },
      ],
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
              return '카드 결제 적립금 비율을 입력해주세요';
            }

            if (value < 0) {
              return '적립금 비율은 0 이상이어야 합니다.';
            }
            if (value > 1.8) {
              return '적립금 비율은 1.8 이하이어야 합니다.';
            }
            return true;
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
              return '무통장 입금 적립금 비율을 입력해주세요';
            }

            if (value < 0) {
              return '적립금 비율은 0 이상이어야 합니다.';
            }
            if (value > 1.8) {
              return '적립금 비율은 1.8 이하이어야 합니다.';
            }
            return true;
          },
          required: true,
        },
      ],
    },
    {
      type: 'ui',
      name: 'separator_margin_2',
      admin: {
        components: {
          Field: '@/collections/components/common/SeparatorMargin',
        },
      },
    },
    {
      type: 'ui',
      name: 'separator_line_3',
      admin: {
        custom: {
          text: '배송비 설정',
          description: '제품의 배송비와 배송비 계산 방식을 설정할 수 있습니다',
        },
        components: {
          Field: '@/collections/components/common/SeparatorLine',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'delivery_fee',
          type: 'number',
          label: '배송비',
          defaultValue: 0,
          required: true,
          admin: {
            width: '50%',
          },
          validate: (value: number | null | undefined) => {
            if (value === null || value === undefined) {
              return '배송비를 입력해주세요';
            }

            if (value < 0) {
              return '배송비는 0 이상이어야 합니다.';
            }
            return true;
          },
        },
      ],
    },
    {
      name: 'is_cost_per_unit',
      type: 'checkbox',
      label: '수량 당 배송비 설정',
      defaultValue: false,
      required: true,
      admin: {
        description:
          '수량 당 배송비를 계산할지에 대한 여부를 설정할 수 있습니다. 활성화 시 배송비는 수량 * 배송비로 계산됩니다.',
        components: {
          Field: '@/collections/components/common/CustomCheckboxField',
        },
        custom: {
          isFirstContent: true,
          isRequireMargin: true,
        },
      },
    },
    {
      name: 'is_free_delivery',
      type: 'checkbox',
      label: '최소주문 금액 이상 시 배송비 무료 여부 설정',
      defaultValue: false,
      required: true,
      admin: {
        description:
          '최소 주문 금액 이상 시 배송비 무료 여부를 선택해주세요 \n 활성화 시 최소주문 금액 이상 주문건에 대한 배송비는 0원으로 처리됩니다',
        components: {
          Field: '@/collections/components/common/CustomCheckboxField',
        },
      },
    },
  ],
};
