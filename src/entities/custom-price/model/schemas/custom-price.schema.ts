import { z } from 'zod';
import { BaseSchema } from '@/shared';

const customPriceSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '아이디는 비어있을 수 없습니다',
  }),
  price: BaseSchema.number({
    min: 0,
  }),
  product: z.object({
    id: BaseSchema.collectionId({
      required_message: '상품아이디는 비어있을 수 없습니다',
    }),
  }),
});
export type CustomPrice = z.infer<typeof customPriceSchema>;

export const customPriceListSchema = z.array(customPriceSchema);
export type CustomPriceList = z.infer<typeof customPriceListSchema>;
