import { ZodSchemaParser } from '@/shared';
import { UpdateUserDto, updateUserSchema } from '@/entities/user';
import { ModifyInfoForm } from '../types';

export class ModifyInfoMapper {
  static formToRequestDto(form: ModifyInfoForm, userId: number) {
    return ZodSchemaParser.safeParseOrThrow(updateUserSchema, {
      data: {
        user: userId,
        data: {
          faxNumber: form.faxNumber,
          managerNumber: form.managerNumber,
          contactEmail: form.email,
          phoneNumber: form.phoneNumber,
          address: `${form.address} | ${form.addressDetail}`,
        },
      } as UpdateUserDto,
      errorMsg: 'ModifyInfoFormData를 UpdateUserDto로 변환하는데 문제가 발생했습니다',
    });
  }
}
