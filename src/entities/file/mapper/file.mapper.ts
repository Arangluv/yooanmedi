import { ZodSchemaParser } from '@/shared';
import { FileEntity } from '../types';
import { fileSchema } from '../schemas';

export class FileMapper {
  static toDomain(file: FileEntity) {
    return ZodSchemaParser.safeParseOrThrow(fileSchema, {
      data: file,
      errorMsg: '잘못된 파일 형식입니다',
    });
  }
}
