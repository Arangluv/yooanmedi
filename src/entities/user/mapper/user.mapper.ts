import { ZodSchemaParser, SchemaParserDto } from '@/shared';
import { USER_ERROR_MESSAGE } from '../constants';
import { userSchema, userListSchema, userSchemaWithHiddenField } from '../schemas';
import { User, UserEntity, UserWithHiddenField } from '../types';

export class UserMapper {
  static responseToUser(data: UserEntity): User {
    const dto: SchemaParserDto = {
      data,
      errorMsg: USER_ERROR_MESSAGE.invalidUser,
    };

    return ZodSchemaParser.safeParseOrThrow(userSchema, dto);
  }

  static responseToUserWithHiddenField(data: UserEntity): UserWithHiddenField {
    const dto: SchemaParserDto = {
      data,
      errorMsg: USER_ERROR_MESSAGE.invalidUser,
    };

    return ZodSchemaParser.safeParseOrThrow(userSchemaWithHiddenField, dto);
  }

  static responseToUserList(data: UserEntity[]): User[] {
    const dto: SchemaParserDto = {
      data,
      errorMsg: USER_ERROR_MESSAGE.invalidUser,
    };

    return ZodSchemaParser.safeParseOrThrow(userListSchema, dto);
  }
}
