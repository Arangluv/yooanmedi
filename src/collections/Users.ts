import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '유저',
    plural: '유저',
  },
  admin: {
    defaultColumns: ['email', 'role', 'createdAt'],
    useAsTitle: 'email',
    group: '홈페이지 설정',
  },
  auth: true,
  access: {
    admin: ({ req }) => {
      return req.user?.role === 'admin'
    },
  },
  fields: [
    {
      type: 'select',
      name: 'role',
      label: '유저 타입',
      admin: {
        description: '유저 타입을 선택해주세요',
      },
      options: [
        {
          label: '관리자',
          value: 'admin',
        },
        {
          label: '클라이언트',
          value: 'client',
        },
      ],
      defaultValue: 'client',
    },
  ],
}
