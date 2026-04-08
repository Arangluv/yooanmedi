import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { Logger } from '../logger';
import { BusinessLogicError, SystemError, ZodParseError } from '../../errors/domain.error';
import { zodSafeParse } from '@/shared/lib/zod';

describe('Logger', () => {
  describe('ZodParseError', () => {
    it('ZodParseError 처리 시 올바른 형식으로 출력된다', () => {
      try {
        const testZodSchema = z.object({
          name: z.string(),
          age: z.number(),
        });

        const testData = {
          name: 'test',
          age: '20',
        };
        zodSafeParse(testZodSchema, testData);
      } catch (error) {
        Logger.error(error);
      }
    });
  });

  describe('BusinessLogicError', () => {
    it('BusinessLogicError 처리 시 올바른 형식으로 출력된다', () => {
      const error = new BusinessLogicError('비즈니스 로직 에러');
      error.setDevMessage('비즈니스 로직 에러 개발자 메시지');
      Logger.error(error);
    });
  });

  describe('SystemError', () => {
    it('SystemError 처리 시 올바른 형식으로 출력된다', () => {
      const error = new SystemError('시스템 에러');
      error.setDevMessage('시스템 에러 개발자 메시지');
      Logger.error(error);
    });
  });

  describe('Error', () => {
    it('Error 처리 시 올바른 형식으로 출력된다', () => {
      const error = new Error('test error');
      Logger.error(error);
    });
  });

  describe('unknown', () => {
    it('unknown 처리 시 올바른 형식으로 출력된다', () => {
      const error = 'test';
      Logger.error(error);
    });
  });
});
