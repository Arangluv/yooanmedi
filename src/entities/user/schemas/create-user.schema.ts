import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { USER_ROLE } from '@/entities/user';
import { userSchema } from './user.schema';

export const createClientSchema = userSchema
  .pick({
    username: true,
    role: true,
    isApproved: true,
    point: true,
    ceo: true,
    hospitalName: true,
    doctorLicenseNumber: true,
    businessNumber: true,
    nursingNumber: true,
    address: true,
    contactEmail: true,
    phoneNumber: true,
    faxNumber: true,
    managerNumber: true,
  })
  .extend({
    password: BaseSchema.string({ required_message: '비밀번호가 누락되었습니다' }),
    isApproved: z.literal(false),
    role: z.literal(USER_ROLE.client),
    fileList: z.array(z.number('파일 아이디가 누락되었습니다')),
  });
