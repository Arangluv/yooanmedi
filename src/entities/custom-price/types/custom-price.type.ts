import { z } from 'zod';
import { PayloadCustomPrice } from '@/shared';
import { customPriceSchema } from '../schemas';

export type CustomPrice = z.infer<typeof customPriceSchema>;
export type CustomPriceEntity = PayloadCustomPrice;
