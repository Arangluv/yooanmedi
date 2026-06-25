import { ZodSchemaParser } from '@/shared';
import { termsSchema } from '../schemas';
import { Terms, TermsEntity } from '../types';

export class TermsMapper {
  static toDomain(data: TermsEntity): Terms {
    return ZodSchemaParser.safeParseOrThrow(termsSchema, {
      data,
      errorMsg: '올바르지 않은 약관 데이터입니다',
    });
  }
}
