import { GlobalConfig } from 'payload';

export const banner: GlobalConfig = {
  slug: 'banner',
  label: '배너관리',
  access: {
    read: () => true,
  },
  admin: {
    group: '홈페이지 설정',
    components: {
      elements: {
        Description: '@/shared/ui/admin/DocumentLink',
      },
    },
  },
  lockDocuments: false,
  fields: [
    {
      type: 'array',
      name: 'items',
      label: '배너 이미지',
      admin: {
        components: {
          RowLabel: '@/shared/server/configs/payload-cms/components/common/ArrayLabel',
        },
      },
      fields: [
        {
          name: 'image',
          label: '배너 이미지',
          type: 'upload',
          relationTo: 'banner-image',
          admin: {
            description:
              '홈페이지 메인에 들어가는 배너이미지를 선택해주세요 \n 권장 비율 85 : 36 \n ex. 850 * 360, 1700 * 720',
          },
        },
      ],
    },
  ],
};
