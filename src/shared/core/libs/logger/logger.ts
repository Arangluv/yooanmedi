import { ERROR_CODE, UNKNOWN_ERROR_CODE } from '../errors/base.error';
import {
  BusinessLogicError,
  DATABASE_ERROR_CODE,
  SystemError,
  ZodParseError,
} from '../errors/domain.error';

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

    if (error && typeof error === 'object' && error?.constructor?.name === 'DatabaseError') {
      const code = (error as any).code;
      const detail = (error as any).detail;
      const table = (error as any).table;

      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(`code: ${code} \n detail: ${detail} \n table: ${table}`);
      console.log('[Logger] - Code');
      console.log(DATABASE_ERROR_CODE);
      console.log(SPACER);
      return;
    }

    // {
    //   "data": {
    //     "id": 3,
    //     "collection": "users",
    //     "errors": [
    //       {
    //         "label": "적립금",
    //         "message": "적립금은 0 이상이어야 합니다.",
    //         "path": "point"
    //       }
    //     ]
    //   },
    //   "isOperational": true,
    //   "isPublic": false,
    //   "status": 400,
    //   "name": "ValidationError"
    // }
    if (error && typeof error === 'object' && error?.constructor?.name === 'ValidationError') {
      // payload validation error
      console.log(error);

      return;
    }

    if (error instanceof Error) {
      console.log(`error?.constructor?.name ${error?.constructor?.name}`);

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
