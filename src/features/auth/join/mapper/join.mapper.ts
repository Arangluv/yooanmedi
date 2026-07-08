import { File } from '@/entities/file';
import { createClientSchema, CreateClientRequestDto, USER_ROLE } from '@/entities/user';
import { JoinForm } from '../types';
import { ZodSchemaParser } from '@/shared';

export class JoinMapper {
  static formToRequestDto({ form, file }: { form: JoinForm; file: File }): CreateClientRequestDto {
    const DEFAULT_POINT = 0;
    const DEFAULT_APPROVE_STATE = false;

    return ZodSchemaParser.safeParseOrThrow(createClientSchema, {
      data: {
        username: form.id,
        password: form.password,
        ceo: form.ceo,
        hospitalName: form.hospitalName,
        doctorLicenseNumber: form.doctorLicenseNumber,
        businessNumber: form.businessNumber,
        nursingNumber: form.nursingNumber,
        address: `${form.address} | ${form.addressDetail}`,
        phoneNumber: form.phoneNumber,
        faxNumber: form.faxNumber,
        managerNumber: form.managerNumber,
        contactEmail: form.email,
        fileList: [file.id],
        isApproved: DEFAULT_APPROVE_STATE,
        point: DEFAULT_POINT,
        role: USER_ROLE.client,
      } as CreateClientRequestDto,
      errorMsg: 'CreateClientRequestDto로 변환하는 과정에서 문제가 발생했습니다',
    });
  }
}
