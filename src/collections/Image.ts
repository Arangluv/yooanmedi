import type { CollectionConfig } from 'payload'

export const Image: CollectionConfig = {
  slug: 'image',
  access: {
    read: () => true,
  },
  admin: {
    group: '파일 & 이미지',
  },
  labels: {
    singular: '이미지',
    plural: '이미지',
  },
  upload: {
    formatOptions: {
      format: 'webp',
      options: {
        quality: 75,
      },
    },
  },

  fields: [
    {
      name: 'alt',
      label: '이미지 설명',
      type: 'text',
      admin: {
        description:
          '이미지 설명에 해당되는 부분으로 필수는 아니지만 SEO가 중요하다면 설정해주세요',
      },
    },
  ],
}
