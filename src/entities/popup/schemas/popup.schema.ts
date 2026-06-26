import { z } from 'zod';
import { BaseSchema, PayloadImage, PayloadRichTextContent } from '@/shared';

// {
//   id: 1,
//   popupItems: [
//     {
//       id: '6a3ce6c85a53964bd07742a8',
//       isOnlyImage: true,
//       image: [Object],
//       content: null
//     },
//     {
//       id: '6a3ce6d55a53964bd07742aa',
//       isOnlyImage: false,
//       image: null,
//       content: [Object]
//     }
//   ],
//   updatedAt: '2026-06-25T08:29:27.692Z',
//   createdAt: '2026-01-05T14:07:27.896Z',
//   globalType: 'popup'
// }

// {
//   id: 1,
//   popupItems: [],
//   updatedAt: '2026-06-25T08:33:44.976Z',
//   createdAt: '2026-01-05T14:07:27.896Z',
//   globalType: 'popup'
// }

export const PopupItemSchemas = {
  onlyImage: z.object({
    id: BaseSchema.string({
      required_message: '팝업 아이템 아이디가 누락되었습니다',
      invalid_message: '잘못된 팝업 아이디 타입입니다',
    }),
    isOnlyImage: z.literal(true),
    image: z.custom<PayloadImage>(),
    content: z.literal(null),
  }),

  textContent: z.object({
    id: BaseSchema.string({
      required_message: '팝업 아이템 아이디가 누락되었습니다',
      invalid_message: '잘못된 팝업 아이디 타입입니다',
    }),
    isOnlyImage: z.literal(false),
    image: z.literal(null),
    content: z.custom<PayloadRichTextContent>(),
  }),
};

export const popupSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '팝업 아이디가 누락되었습니다',
    invalid_message: '잘못된 팝업 아이디 타입입니다',
  }),
  popupItems: z.array(
    z.discriminatedUnion('isOnlyImage', [PopupItemSchemas.onlyImage, PopupItemSchemas.textContent]),
  ),
});
