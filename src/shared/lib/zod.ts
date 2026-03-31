import { z } from 'zod';
import { ZodParseError } from '../model/errors/domain.error';

export const zodSafeParse = <T>(schema: z.ZodSchema<T>, dto: unknown): T => {
  const result = schema.safeParse(dto);
  if (result.success) return result.data;

  const clientMessage = '입력값이 올바르지 않습니다.';
  const devMessage = ZodParseError.generateErrorDevMessage(result.error);
  const zodError = new ZodParseError(clientMessage);
  zodError.setDevMessage(devMessage);

  throw zodError;
};
