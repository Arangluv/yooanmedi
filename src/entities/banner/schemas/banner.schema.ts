import { BaseSchema, PayloadImage } from '@/shared';
import { z } from 'zod';

export const bannerItemSchema = z.object({
  id: BaseSchema.string({
    required_message: '배너아이템 아이디가 누락되었습니다',
    invalid_message: '잘못된 배너 아이디 타입입니다',
  }),
  image: z.custom<PayloadImage>(),
});

export const bannerSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '배너 아이디가 누락되었습니다',
    invalid_message: '잘못된 배너 아이디 타입입니다',
  }),
  items: z.array(bannerItemSchema),
});
