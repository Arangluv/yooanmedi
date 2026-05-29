import { NotFound, ValidationError } from 'payload';
import { BaseError } from '../../../core/libs/errors';

export class PayloadCmsErrorTranslator {
  static throwBaseError(error: unknown, clientMsg: string): never {
    if (error instanceof BaseError) {
      throw error;
    }

    if (error instanceof NotFound) {
      throw new BaseError({ clientMsg, errorName: 'PayloadNotFoundError' });
    }

    // message example : 다음 필드들이 유효하지 않습니다 대표자명, 상호명..
    if (error instanceof ValidationError) {
      throw new BaseError({
        clientMsg,
        devMsg: error.message,
        errorName: 'PayloadValidationError',
      });
    }

    throw new BaseError({
      clientMsg,
      errorName: 'UnknownAdapterError',
    });
  }
}
