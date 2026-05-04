import { getCustomPrices } from './get-custom-prices';
import { customPriceListSchema, type CustomPrice } from '../model/schemas/custom-price.schema';
import { FindOption, zodSafeParse } from '@/shared';

export class CustomPriceRepository {
  public static async findMany(option: FindOption): Promise<CustomPrice[]> {
    const customPrices = await getCustomPrices(option);
    return zodSafeParse(customPriceListSchema, customPrices);
  }
}
