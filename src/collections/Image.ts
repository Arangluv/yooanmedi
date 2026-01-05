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
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/vnd.microsoft.icon',
      'image/x-icon',
      'image/avif',
      'image/svg+xml',
    ],
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
        description: '필수x, 이미지 설명을 입력해주세요. ex) 제품명',
      },
    },
  ],
}
