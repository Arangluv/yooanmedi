import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { GlobalConfig } from 'payload'

export const PopupSetting: GlobalConfig = {
  slug: 'popup',
  label: '팝업관리',
  admin: {
    group: '홈페이지 설정',
  },
  fields: [
    {
      type: 'array',
      name: 'popupItems',
      label: '팝업 컨텐츠',
      admin: {
        components: {
          RowLabel: '@/collections/components/common/ArrayLabel',
        },
      },
      fields: [
        {
          name: 'isOnlyImage',
          label: '이미지만 사용',
          admin: {
            description: '이미지만 표시하려면 체크해주세요',
          },
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'image',
          label: '이미지',
          type: 'upload',
          relationTo: 'image',
          admin: {
            description: '이미지를 선택해주세요',
            condition: (data, siblingData) => {
              return siblingData.isOnlyImage === true
            },
          },
        },
        {
          name: 'content',
          type: 'richText',
          label: '내용',
          admin: {
            description: '내용을 입력해주세요',
            condition: (data, siblingData) => {
              return (
                siblingData.isOnlyImage === false ||
                siblingData.isOnlyImage === undefined ||
                siblingData.isOnlyImage === null
              )
            },
          },
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              FixedToolbarFeature(),
              EXPERIMENTAL_TableFeature(),
              UploadFeature({
                collections: {
                  uploads: {
                    // Example showing how to customize the built-in fields
                    // of the Upload feature
                    fields: [
                      {
                        name: 'caption',
                        type: 'richText',
                        editor: lexicalEditor(),
                      },
                    ],
                  },
                },
              }),
              LinkFeature({
                fields: ({ defaultFields }) => [
                  ...defaultFields,
                  {
                    name: 'rel',
                    label: 'Rel Attribute',
                    type: 'select',
                    hasMany: true,
                    options: ['noopener', 'noreferrer', 'nofollow'],
                    admin: {
                      description:
                        'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
                    },
                  },
                ],
              }),
            ],
          }),
        },
      ],
    },
  ],
}
