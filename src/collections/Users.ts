import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '유저',
    plural: '유저',
  },
  lockDocuments: false,
  admin: {
    defaultColumns: [
      'id',
      'username',
      'hospitalName',
      'phoneNumber',
      'role',
      'isApproved',
      'adjust_price_btn',
    ],
    useAsTitle: 'hospitalName',
    group: '유저 관리',
    components: {
      views: {
        list: {
          Component: '@/collections/components/common/UserListViewSetDialog',
        },
      },
    },
  },
  auth: {
    loginWithUsername: true,
    useSessions: false,
    tokenExpiration: 60 * 60 * 2, // 2시간
  },
  access: {
    admin: ({ req }) => {
      return req.user?.role === 'admin';
    },
  },
  fields: [
    {
      type: 'ui',
      name: 'separator_line_1',
      admin: {
        custom: {
          text: '회원관리',
          description: '회원의 권한 설정 및 회원가입 승인 여부를 설정할 수 있습니다',
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
          type: 'select',
          name: 'role',
          label: '유저 타입',
          admin: {
            description: '유저 타입을 선택해주세요',
            width: '33.33%',
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
    },
    {
      type: 'row',
      fields: [
        {
          type: 'checkbox',
          name: 'isApproved',
          label: '회원가입 승인 여부',
          custom: {
            check: {
              color: 'success',
              text: '승인',
            },
            uncheck: {
              color: 'default',
              text: '승인대기',
            },
            admin: {
              color: 'default',
              text: '-',
            },
          },
          admin: {
            description: '회원가입 승인 여부를 선택해주세요 활성화 시 회원가입이 승인됩니다',
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
            components: {
              Field: '@/collections/components/common/CustomCheckboxField',
              Cell: '@/collections/components/common/cells/BadgeCell',
            },
          },
          defaultValue: false,
        },
      ],
    },
    {
      type: 'text',
      name: 'username',
      label: '아이디',
      required: true,
      unique: true,
      index: true,
      validate: (value: string | null | undefined) => {
        if (!value) {
          return '아이디를 입력해주세요';
        }
        if (value.length < 4 || value.length > 20) {
          return '아이디는 4자 이상 20자 이하로 입력해주세요';
        }
        return true;
      },
    },
    {
      type: 'ui',
      name: 'separator_line_2',
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
          text: '회원정보',
          description: '일반회원의 기본 정보를 확인할 수 있습니다',
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
          type: 'number',
          name: 'point',
          label: '적립금',
          access: {
            read: ({ req }) => {
              return req.user?.role === 'admin';
            },
          },
          admin: {
            width: '33.33%',
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
          validate: (value: number | null | undefined) => {
            if (value === null || value === undefined) {
              return true;
            }
            if (value < 0) {
              return '적립금은 0 이상이어야 합니다.';
            }
            return true;
          },
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'ceo',
          label: '대표자명',
          admin: {
            width: '33.33%',
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
          required: true,
        },
        {
          type: 'text',
          name: 'hospitalName',
          label: '상호명',
          admin: {
            width: '33.33%',
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'doctorLicenseNumber',
          label: '의사면허번호',
          admin: {
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
        },
        {
          type: 'text',
          name: 'businessNumber',
          label: '사업자등록번호',
          unique: true,
          admin: {
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
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
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'address',
          label: '주소',
          admin: {
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
            width: '33.33%',
          },
          required: true,
        },
        {
          type: 'email',
          name: 'contactEmail',
          label: '이메일',
          admin: {
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
            width: '33.33%',
          },
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          name: 'phoneNumber',
          label: '전화번호',
          admin: {
            width: '33.33%',
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
          required: true,
        },
        {
          type: 'text',
          name: 'faxNumber',
          label: 'FAX번호',
          admin: {
            width: '33.33%',
            condition: (data, siblingData) => {
              return siblingData.role === 'client';
            },
          },
        },
      ],
    },
    {
      type: 'upload',
      name: 'fileList',
      label: '증빙서류',
      admin: {
        condition: (data, siblingData) => {
          return siblingData.role === 'client';
        },
      },
      required: true,
      relationTo: 'files',
      hasMany: true,
    },
    {
      type: 'ui',
      name: 'adjust_price_btn',
      label: '가격 조정',
      admin: {
        components: {
          Cell: '@/collections/components/price/PriceAdjustBtnCell',
        },
      },
    },
  ],
};
