import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { USER_ERROR_MESSAGE } from '../constants';
import { userSchema, userListSchema } from '../schemas';
import { User } from '../types';

export class UserMapper {
  static toUser(data: unknown): User {
    const dto: SchemaParserDto = {
      data,
      errorMsg: USER_ERROR_MESSAGE.invalidUser,
    };

    return ZodSchemaParser.safeParseOrThrow(userSchema, dto);
  }

  static toUserList(data: unknown): User[] {
    const dto: SchemaParserDto = {
      data,
      errorMsg: USER_ERROR_MESSAGE.invalidUser,
    };

    return ZodSchemaParser.safeParseOrThrow(userListSchema, dto);
  }
}
