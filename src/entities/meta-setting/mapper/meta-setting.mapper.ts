import { ZodSchemaParser } from '@/shared';
import { MetaSetting, MetaSettingEntity } from '../types';
import { metaSettingSchema } from '../schemas';

export class MetaSettingMapper {
  static toDomain(data: MetaSettingEntity): MetaSetting {
    return ZodSchemaParser.safeParseOrThrow(metaSettingSchema, {
      data: {
        id: data.id,
        minOrderPrice: data.min_order_price,
      },
      errorMsg: '사이트 메타데이터를 domain 객체로 변환하는데 문제가 발생했습니다',
    });
  }
}
