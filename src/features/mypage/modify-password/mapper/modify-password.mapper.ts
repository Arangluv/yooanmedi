import { ZodSchemaParser } from '@/shared';
import { User, UpdateUserDto, updateUserSchema } from '@/entities/user';
import { ModifyPasswordForm, ModifyPasswordDto } from '../types';
import { modifyPasswordDtoSchema } from '../schemas';

export class ModifyPasswordMapper {
  static formToDto(form: ModifyPasswordForm, user: User): ModifyPasswordDto {
    return ZodSchemaParser.safeParseOrThrow(modifyPasswordDtoSchema, {
      data: {
        user: user.id,
        currentPassword: form.currentPassword,
        password: form.password,
      } as ModifyPasswordDto,
      errorMsg: 'ModifyPasswordForm을 Dto로 변환하는 과정에서 문제가 발생했습니다',
    });
  }

  static dtoToUpdateUserDto(dto: ModifyPasswordDto): UpdateUserDto {
    return ZodSchemaParser.safeParseOrThrow(updateUserSchema, {
      data: {
        user: dto.user,
        data: {
          password: dto.password,
        },
      } as UpdateUserDto,
      errorMsg: 'ModifyPasswordDto를 UpdateUserDto로 변환하는 과정에서 문제가 발생했습니다',
    });
  }
}
