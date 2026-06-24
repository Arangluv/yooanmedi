import { PAYMENT_HISTORY_ERROR_MESSAGE } from '../constant';
import { paymentHistorySchema } from '../schemas';
import { PaymentHistoryEntity } from '../types';
import { ZodSchemaParser, SchemaParserDto } from '@/shared';

export class PaymentHistoryMapper {
  static entityToDomain(data: PaymentHistoryEntity) {
    const dto = {
      data,
      errorMsg: PAYMENT_HISTORY_ERROR_MESSAGE.invalidData,
    } as SchemaParserDto;
    return ZodSchemaParser.safeParseOrThrow(paymentHistorySchema, dto);
  }
}
