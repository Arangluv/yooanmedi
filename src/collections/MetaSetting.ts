import { GlobalConfig } from 'payload';

export const MetaSetting: GlobalConfig = {
  slug: 'meta-setting',
  label: '메타데이터 설정',
  admin: {
    group: '홈페이지 설정',
  },
  fields: [
    {
      name: 'min_order_price',
      type: 'number',
      label: '최소 주문 금액 설정',
      defaultValue: 0,
      admin: {
        description: '배송비 무료를 적용할 최소 주문 금액을 설정해주세요',
      },
    },
  ],
};
