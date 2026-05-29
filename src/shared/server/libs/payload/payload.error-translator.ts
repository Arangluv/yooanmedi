import { NotFound, ValidationError } from 'payload';
import { BaseError } from '../../../core/libs/errors';

export class PayloadCmsErrorTranslator {
  static toBaseError(error: unknown, clientMsg: string): BaseError {
    if (error instanceof NotFound) {
      return new BaseError({ clientMsg, errorName: 'PayloadNotFoundError' });
    }

    // message example : 다음 필드들이 유효하지 않습니다 대표자명, 상호명..
    if (error instanceof ValidationError) {
      return new BaseError({
        clientMsg,
        devMsg: error.message,
        errorName: 'PayloadValidationError',
      });
    }

    return new BaseError({
      clientMsg,
      errorName: 'UnknownDataBaseError',
    });
  }
}
