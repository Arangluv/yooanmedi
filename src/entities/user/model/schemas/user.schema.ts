import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { USER_ROLE } from '../../constants/role';

export const userSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '유저 아이디는 필수값입니다',
    invalid_message: '잘못된 유저타입 입니다',
  }), // collection 유니크 아이디
  role: z.enum([USER_ROLE.client, USER_ROLE.admin]),
  isApproved: z.boolean(),
  point: BaseSchema.number({
    min: 0,
  }),
  ceo: BaseSchema.string({}),
  hospitalName: BaseSchema.string({}),
  doctorLicenseNumber: BaseSchema.string({}),
  businessNumber: BaseSchema.string({}),
  nursingNumber: BaseSchema.string({}),
  address: BaseSchema.string({}),
  contactEmail: BaseSchema.email,
  email: BaseSchema.email,
  phoneNumber: BaseSchema.string({}),
  faxNumber: BaseSchema.string({}),
  username: BaseSchema.string({}), // 도메인의 ID
});

export type User = z.infer<typeof userSchema>;
