import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const metaSettingSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '메타세팅 아이디가 누락되었습니다',
    invalid_message: '잘못된 메타세팅 아이디 타입입니다',
  }),
  minOrderPrice: BaseSchema.number({
    required_message: '주문 시 배송비가 할인되는 최소주문값이 누락되었습니다',
    min: 0,
  }),
});
