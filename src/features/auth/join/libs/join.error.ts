import { BaseError } from '@/shared';
import { User } from '@/entities/user';

export interface DuplicateFieldErrorData {
  message: string;
  field: keyof User;
}

export class JoinDuplicateFieldError extends BaseError<DuplicateFieldErrorData> {
  constructor({
    clientMsg,
    errorName = 'DuplicatedFieldError',
    data,
  }: {
    clientMsg: string;
    errorName?: string;
    data: DuplicateFieldErrorData;
  }) {
    super({ clientMsg, errorName, data });
  }
}
