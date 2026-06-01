import { BaseError } from '../errors';

export class TestErrorHelper {
  static generateAdapterError() {
    return new BaseError({ clientMsg: 'test error msg', errorName: 'TestError' });
  }
}
