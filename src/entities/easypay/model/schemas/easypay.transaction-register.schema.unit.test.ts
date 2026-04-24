import { describe, it, expect } from 'vitest';
import { TransactionRegistrationFixture } from '../../__test__/easypay.fixture';
import {
  toRegisterTransactionServiceDto,
  toRegisterTransactionResult,
  registerTransactionServiceSchema,
  easypayRegisterTransactionSuccessResultSchema,
  easypayRegisterTransactionFailureResultSchema,
} from './easypay.register-transaction.schema';

describe('easypayRegisterTransactionSchema', () => {
  describe('toRegisterTransactionServiceDto', () => {
    it('requestDto가 serviceDto로 파싱된다', () => {
      const result = toRegisterTransactionServiceDto(
        TransactionRegistrationFixture.requestDto as any,
      );
      expect(result).toEqual(expect.schemaMatching(registerTransactionServiceSchema));
    });

    it('requestDto가 올바르지 않을시 Error를 throw한다', () => {
      /**
       * TODO:: 기록 / 공부
       * ZodParseError 혹은 Error 중 하나를 Throw한다.
       * zod에서 제공하는 refine과 transform을 사용하면 데이터 파싱 시 발생하는 오류라고 명확하게 구분하기 쉽지만
       * 테스트 작성이 어렵고, 어떤 input과 output이 나오는지 schema만 보았을때 명확히 파악하기 어렵다.
       * 따라서 zod의 transform을 사용하지않고 명시적으로 함수로 작성해주었다.
       * input과 output이 다를때, zod 내장객체를 사용하면서 명시적으로 예외처리를 해주는 방법이 있을까에 대한 고민이 필요하다
       */
      expect(() =>
        toRegisterTransactionServiceDto(TransactionRegistrationFixture.invalidRequestDto as any),
      ).toThrow(Error);
    });
  });

  describe('toRegisterTransactionResult', () => {
    it('이지페이의 결제등록 성공 시 SuccessResult를 반환한다', () => {
      const result = toRegisterTransactionResult(
        TransactionRegistrationFixture.easypaySuccessResponse,
      );
      expect(result).toEqual(expect.schemaMatching(easypayRegisterTransactionSuccessResultSchema));
    });

    it('이지페이의 결제등록 실패 시 FailureResult를 반환한다', () => {
      const result = toRegisterTransactionResult(
        TransactionRegistrationFixture.easypayFailureResponse,
      );
      expect(result).toEqual(expect.schemaMatching(easypayRegisterTransactionFailureResultSchema));
    });
  });
});
