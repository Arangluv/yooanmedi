import { z } from 'zod';
import { BaseError, ZodParseError } from '../errors';
import { $ZodErrorTree } from 'zod/v4/core';

// todo :: will deprecated
export const zodSafeParse = <T>(schema: z.ZodType<T>, dto: unknown): T => {
  const result = schema.safeParse(dto);
  if (result.success) return result.data;

  const clientMessage = '입력값이 올바르지 않습니다.';
  const devMessage = ZodParseError.generateErrorDevMessage(result.error);
  const zodError = new ZodParseError(clientMessage);
  zodError.setDevMessage(devMessage);

  throw zodError;
};

export interface SchemaParserDto {
  data: unknown;
  errorMsg: string;
}

export class ZodSchemaParser {
  static safeParseOrThrow<T>(schema: z.ZodType<T>, dto: SchemaParserDto): T {
    const result = schema.safeParse(dto.data);
    if (!result.success) {
      const pretty = z.prettifyError(result.error);
      throw BaseError.validationError({ clientMsg: dto.errorMsg, devMsg: pretty });
    }
    return result.data;
  }

  static safeParse<T>(schema: z.ZodType<T>, dto: unknown): T | $ZodErrorTree<T, string> {
    const result = schema.safeParse(dto);
    if (result.success) return result.data;

    const fieldErrors = z.treeifyError(result.error);
    return fieldErrors;
  }
}
