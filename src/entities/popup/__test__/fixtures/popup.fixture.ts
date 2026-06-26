import { PayloadRichTextContent } from '@/shared';
import { Popup, PopupEntity } from '../../types';

export const PopupFixtures = {
  domain: {
    id: 1,
    popupItems: [
      {
        id: '6a3ce6c85a53964bd07742a8',
        isOnlyImage: true,
        image: {
          id: 196,
          updatedAt: '2026-01-07T05:33:20.983Z',
          createdAt: '2026-01-07T05:33:20.507Z',
          url: '/api/image/file/-1ml-50a-1767764000584.webp',
          thumbnailURL: null,
          filename: '-1ml-50a-1767764000584.webp',
          mimeType: 'image/webp',
          filesize: 34136,
          width: 249,
          height: 335,
          focalX: 50,
          focalY: 50,
        },
        content: null,
      },
      {
        id: '6a3ce6d55a53964bd07742aa',
        isOnlyImage: false,
        image: null,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: " '주식회사 유안메디팜'은 (이하 '회사'는) 고객님의 개인정보를 중요시하며, \"정보통신망 이용촉진 및 정보보호\"에 관한 법률을 준수하고 있습니다.",
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                textStyle: '',
                textFormat: 0,
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: '회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                textStyle: '',
                textFormat: 0,
              },
            ],
            direction: 'ltr',
            textFormat: 1,
          },
        } as PayloadRichTextContent,
      },
    ],
  } as Popup,

  entity: {
    id: 1,
    popupItems: [
      {
        id: '6a3ce6c85a53964bd07742a8',
        isOnlyImage: true,
        image: {
          id: 196,
          updatedAt: '2026-01-07T05:33:20.983Z',
          createdAt: '2026-01-07T05:33:20.507Z',
          url: '/api/image/file/-1ml-50a-1767764000584.webp',
          thumbnailURL: null,
          filename: '-1ml-50a-1767764000584.webp',
          mimeType: 'image/webp',
          filesize: 34136,
          width: 249,
          height: 335,
          focalX: 50,
          focalY: 50,
        },
        content: null,
      },
      {
        id: '6a3ce6d55a53964bd07742aa',
        isOnlyImage: false,
        image: null,
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: " '주식회사 유안메디팜'은 (이하 '회사'는) 고객님의 개인정보를 중요시하며, \"정보통신망 이용촉진 및 정보보호\"에 관한 법률을 준수하고 있습니다.",
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                textStyle: '',
                textFormat: 0,
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: '회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                textStyle: '',
                textFormat: 0,
              },
            ],
            direction: 'ltr',
            textFormat: 1,
          },
        } as PayloadRichTextContent,
      },
    ],
    updatedAt: '2026-06-25T08:29:27.692Z',
    createdAt: '2026-01-05T14:07:27.896Z',
    globalType: 'popup',
  } as PopupEntity,
};
