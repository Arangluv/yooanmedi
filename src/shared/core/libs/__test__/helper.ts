import { BaseError } from '../errors';

export class TestErrorHelper {
  static generateAdapterError(message = 'test error msg') {
    return new BaseError({ clientMsg: message, errorName: 'TestError' });
  }
}
