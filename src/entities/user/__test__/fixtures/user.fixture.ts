import { User } from '../../types';
import { USER_ROLE } from '../../constants';

export const UserFixtures = {
  valid: {
    basic: {
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
      email: 'test@gmail.com',
      username: 'testUserName',
    },
  },
};

export const baseUserResponseFixture = {
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
};

export const createUserFixture = (override?: Partial<User>): User => {
  return {
    ...UserFixtures.valid.basic,
    ...override,
  };
};

export const createUserResponseFixture = (override?: Partial<typeof baseUserResponseFixture>) => {
  return {
    ...baseUserResponseFixture,
    ...override,
  };
};
