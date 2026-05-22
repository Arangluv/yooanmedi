import { describe, it, expect } from 'vitest';
import { ok, failure, okWithData } from './end-point-result';

describe('end-point-result', () => {
  describe('ok', () => {
    it('기본 endpoint result를 반환한다', () => {
      const result = ok();
      expect(result).toEqual(
        expect.objectContaining({
          isSuccess: true,
          message: 'ok',
        }),
      );
    });

    it('전달한 메세지를 message 필드에 설정한다', () => {
      const result = ok('test success');
      expect(result).toEqual(
        expect.objectContaining({
          isSuccess: true,
          message: 'test success',
        }),
      );
    });
  });

  describe('okWithData', () => {
    it('데이터가 있는 endpoint result를 반환한다', () => {
      const data = {
        id: 1,
        name: 'test',
      };
      const result = okWithData({ data });

      expect(result).toEqual({
        isSuccess: true,
        message: 'ok',
        data,
      });
    });

    it('전달한 메세지를 message 필드에 설정한다', () => {
      const data = {
        id: 1,
        name: 'test',
      };
      const result = okWithData({ data, message: 'test success' });
      expect(result).toEqual(
        expect.objectContaining({
          message: 'test success',
        }),
      );
    });
  });

  describe('failure', () => {
    it('실패한 endpoint result를 반환한다', () => {
      const result = failure('test error');
      expect(result).toEqual(
        expect.objectContaining({
          isSuccess: false,
          message: 'test error',
        }),
      );
    });
  });
});
