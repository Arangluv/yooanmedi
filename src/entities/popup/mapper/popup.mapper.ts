import { ZodSchemaParser } from '@/shared';
import { Popup, PopupEntity } from '../types';
import { popupSchema } from '../schemas';

export class PopupMapper {
  static toDomain(data: PopupEntity): Popup {
    return ZodSchemaParser.safeParseOrThrow(popupSchema, {
      data,
      errorMsg: '잘못된 팝업 데이터입니다',
    });
  }
}
