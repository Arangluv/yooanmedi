import { User, UserEntity } from '../../types';
import { USER_ROLE } from '../../constants';

const baseUserFixture: User = {
  id: 3,
  role: USER_ROLE.client,
  isApproved: true,
  point: 81576,
  ceo: '테스트',
  hospitalName: '테스트병원',
  doctorLicenseNumber: '1',
  businessNumber: '1234567891',
  nursingNumber: '12345679',
  address: '테스트 주소',
  contactEmail: 'test0001@gmail.com',
  phoneNumber: '01012345678',
  faxNumber: '',
  username: 'testUserName',
  managerNumber: '01012345678',
};

const baseUserEntityFixture: UserEntity = {
  id: 3,
  role: USER_ROLE.client,
  isApproved: true,
  point: 71793,
  ceo: '테스트',
  hospitalName: '테스트병원',
  doctorLicenseNumber: '1',
  businessNumber: '1234567891',
  nursingNumber: '12345679',
  address: '테스트 주소',
  contactEmail: 'test0001@gmail.com',
  phoneNumber: '01012345678',
  faxNumber: '',
  fileList: [2],
  updatedAt: '2026-05-13T07:42:38.952Z',
  createdAt: '2025-12-31T05:22:06.431Z',
  email: 'test@gmail.com',
  username: 'testUserName',
  managerNumber: '01027307891',
};

export const createUserFixture = (override?: Partial<User>): User => {
  return {
    ...baseUserFixture,
    ...override,
  };
};

export const createUserEntityFixture = (
  override?: Partial<typeof baseUserEntityFixture>,
): UserEntity => {
  return {
    ...baseUserEntityFixture,
    ...override,
  };
};
