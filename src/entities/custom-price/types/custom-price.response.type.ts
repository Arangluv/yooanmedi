import { PayloadAdapterResult } from '@/shared';
import { CustomPriceEntity } from './custom-price.type';

export type GetCustomPricesReponse = PayloadAdapterResult<CustomPriceEntity[]>;
