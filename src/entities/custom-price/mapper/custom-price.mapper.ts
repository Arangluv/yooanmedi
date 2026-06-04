import { SchemaParserDto, ZodSchemaParser } from '@/shared';
import { CustomPriceEntity } from '../types';
import { CUSTOM_PRICE_ERROR_MESSAGE } from '../constants';
import { customPricesSchema } from '../schemas';

export class CustomPriceMapper {
  static entitiesToDomainList(data: CustomPriceEntity[]) {
    const dto = {
      data,
      errorMsg: CUSTOM_PRICE_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;
    return ZodSchemaParser.safeParseOrThrow(customPricesSchema, dto);
  }
}
