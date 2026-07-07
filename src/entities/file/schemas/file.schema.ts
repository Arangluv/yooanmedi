import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const fileSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '파일 아이디가 누락되었습니다',
    invalid_message: '잘못된 파일아이디 타입입니다',
  }),
  url: BaseSchema.string({
    required_message: '파일 URL이 누락되었습니다',
  }),
  filename: BaseSchema.string({
    required_message: '파일 이름이 누락되었습니다',
  }),
  filesize: BaseSchema.number({
    min: 0,
    required_message: '파일사이즈가 누락되었습니다',
  }),
});
