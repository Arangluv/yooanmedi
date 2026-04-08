import { ERROR_CODE, UNKNOWN_ERROR_CODE } from '../errors/base.error';
import { BusinessLogicError, SystemError, ZodParseError } from '../errors/domain.error';

const SPACER = '--------------------------------';

export class Logger {
  public static error(error: unknown): void {
    if (error instanceof ZodParseError) {
      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(error.getDevMessage() ?? 'Empty DevMessage');
      console.log('[Logger] - Code');
      console.log(error.code);
      console.log(SPACER);
      return;
    }

    if (error instanceof BusinessLogicError) {
      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(error.getDevMessage() ?? 'Empty DevMessage');
      console.log('[Logger] - Code');
      console.log(error.code);
      console.log(SPACER);
      return;
    }

    if (error instanceof SystemError) {
      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(error.getDevMessage() ?? 'Empty DevMessage');
      console.log('[Logger] - Code');
      console.log(error.code);
      console.log(SPACER);
      return;
    }

    if (error instanceof Error) {
      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(error.message ?? 'Empty Message');
      console.log('[Logger] - Code');
      console.log(ERROR_CODE);
      console.log(SPACER);
      return;
    }

    // unknown 에러 처리
    console.log(SPACER);
    console.log('[Logger] - Message');
    console.log(error ?? 'error is unknown type');
    console.log('[Logger] - Code');
    console.log(UNKNOWN_ERROR_CODE);
    console.log(SPACER);
  }
}
