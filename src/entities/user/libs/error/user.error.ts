import { BaseError } from '@/shared';
import { USER_ERROR_MESSAGE } from '../../constants';

export class UserError extends BaseError {
  static unauthorized() {
    return new UserError({
      clientMsg: USER_ERROR_MESSAGE.unauthorized,
      errorName: 'UnauthorizedError',
    });
  }

  static notFound() {
    return new UserError({
      clientMsg: USER_ERROR_MESSAGE.notFound,
      errorName: 'UserNotFoundError',
    });
  }
}
