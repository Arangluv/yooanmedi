import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { PurchasedHistoryEntity } from '../types';
import { purchasedHistorySchema, purchasedHistoriesSchema } from '../schemas';
import { PURCHASED_HISTORY_ERROR_MESSAGE } from '../constants';

export class PurchasedHistoryMapper {
  static entityToDomain(data: PurchasedHistoryEntity) {
    const dto = {
      data,
      errorMsg: PURCHASED_HISTORY_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;
    return ZodSchemaParser.safeParseOrThrow(purchasedHistorySchema, dto);
  }

  static entitiesToDomainList(data: PurchasedHistoryEntity[]) {
    const dto = {
      data,
      errorMsg: PURCHASED_HISTORY_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;
    return ZodSchemaParser.safeParseOrThrow(purchasedHistoriesSchema, dto);
  }
}
