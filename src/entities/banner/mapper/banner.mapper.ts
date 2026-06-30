import { BannerEntity, Banner } from '../types';
import { bannerSchema } from '../schemas';
import { ZodSchemaParser } from '@/shared';

export class BannerMapper {
  static toDomain(data: BannerEntity): Banner {
    return ZodSchemaParser.safeParseOrThrow(bannerSchema, {
      data,
      errorMsg: '배너 데이터를 변환하는데 문제가 발생했습니다',
    });
  }
}
