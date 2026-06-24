import { BaseError } from '../errors';

const SPACER = '--------------------------------';

export class LoggerV2 {
  static error(error: unknown) {
    if (error instanceof BaseError) {
      const devMsg = error.getDevMessage();

      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(error.message);
      console.log('[Logger] - DevMessage');
      console.log(devMsg ? devMsg : 'Empty DevMessage');
      console.log(SPACER);
      return;
    }

    if (error instanceof Error) {
      console.log(SPACER);
      console.log('[Logger] - Message');
      console.log(error.message);
      console.log(error);
      console.log(SPACER);
      return;
    }

    // unknown 에러 처리
    console.log(SPACER);
    console.log('[Logger] - UNKNOWN ERROR');
    console.log(error ?? 'error is unknown type');
    console.log(SPACER);
  }
}
