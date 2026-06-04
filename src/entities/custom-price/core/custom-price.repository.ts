import { FindOption } from '@/shared';
import { CustomPrice } from '../types';

export interface CustomPriceRepository {
  findMany: (option: FindOption) => Promise<CustomPrice[]>;
}
