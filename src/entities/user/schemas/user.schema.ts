import { z } from 'zod';
import { USER_ROLE } from '../constants';

export const userSchema = z.object({
  id: z.number('유저 컬렉션 아이디가 누락되었습니다'), // collection 유니크 아이디
  username: z.string('유저아이디가 누락되었습니다'), // 도메인의 ID
  role: z.enum([USER_ROLE.client, USER_ROLE.admin]),
  isApproved: z.boolean(),
  point: z.number('유저 포인트가 누락되었습니다').min(0, '포인트는 음수가 될 수 없습니다'),
  ceo: z.string(),
  hospitalName: z.string(),
  doctorLicenseNumber: z.string(),
  businessNumber: z.string(),
  nursingNumber: z.string(),
  address: z.string(),
  contactEmail: z.email().nullable(),
  phoneNumber: z.string(),
  faxNumber: z.string(),
  managerNumber: z.string(),
});

export const userSchemaWithHiddenField = userSchema.extend({
  hash: z.string(),
  salt: z.string(),
});

export const userListSchema = z.array(userSchema);
