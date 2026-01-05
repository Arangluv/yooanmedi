import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '유저',
    plural: '유저',
  },
  admin: {
    defaultColumns: ['username', 'hospitalName', 'phoneNumber', 'role', 'isApproved'],
    useAsTitle: 'hospitalName',
    group: '홈페이지 설정',
  },
  auth: {
    loginWithUsername: true,
  },
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
    {
      type: 'checkbox',
      name: 'isApproved',
      label: '승인 여부',
      admin: {
        description: '승인 여부를 선택해주세요 (체크 시 회원가입이 승인됩니다)',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      defaultValue: false,
    },
    {
      type: 'text',
      name: 'username',
      label: '아이디',
      admin: {
        description: '아이디를 입력해주세요',
      },
      required: true,
      unique: true,
      index: true,
      validate: (value: string | null | undefined) => {
        if (!value) {
          return '아이디를 입력해주세요'
        }
        if (value.length < 4 || value.length > 20) {
          return '아이디는 4자 이상 20자 이하로 입력해주세요'
        }
        return true
      },
    },
    {
      type: 'text',
      name: 'ceo',
      label: '대표자명',
      admin: {
        description: '대표자명을 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'text',
      name: 'hospitalName',
      label: '병원명',
      admin: {
        description: '병원명을 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'email',
      name: 'email',
      label: '이메일',
      admin: {
        description: '이메일을 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'text',
      name: 'address',
      label: '주소',
      admin: {
        description: '주소를 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'text',
      name: 'businessNumber',
      label: '사업자등록번호',
      unique: true,
      admin: {
        description: '사업자등록번호를 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'text',
      name: 'nursingNumber',
      label: '요양기관번호',
      unique: true,
      admin: {
        description: '요양기관번호를 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'text',
      name: 'phoneNumber',
      label: '전화번호',
      admin: {
        description: '전화번호를 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
    },
    {
      type: 'text',
      name: 'faxNumber',
      label: 'FAX번호',
      admin: {
        description: 'FAX번호를 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
    },
    {
      type: 'upload',
      name: 'fileList',
      label: '증빙서류',
      admin: {
        description: '증빙서류를 업로드해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      required: true,
      relationTo: 'files',
      hasMany: true,
    },
    {
      type: 'number',
      name: 'point',
      label: '적립금',
      access: {
        read: ({ req }) => {
          return req.user?.role === 'admin'
        },
      },
      admin: {
        description: '적립금을 입력해주세요',
        condition: (data, siblingData) => {
          return siblingData.role === 'client'
        },
      },
      validate: (value: number | null | undefined) => {
        if (value === null || value === undefined) {
          return true
        }
        if (value < 0) {
          return '적립금은 0 이상이어야 합니다.'
        }
        return true
      },
      required: true,
      defaultValue: 0,
    },
  ],
}
