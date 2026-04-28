export const baseUserFixture = {
  id: 3,
  role: 'client',
  isApproved: true,
  point: 81576,
  ceo: '김이박',
  hospitalName: '인천병원',
  doctorLicenseNumber: '1',
  businessNumber: '1234567891',
  nursingNumber: '12345679',
  address: '인천 강화군 강화읍 갑곳리 1076-6 , 23026',
  contactEmail: 'test0001@gmail.com',
  phoneNumber: '01012345678',
  faxNumber: '',
  updatedAt: '2026-04-24T08:08:26.639Z',
  createdAt: '2025-12-31T05:22:06.431Z',
  email: 'test0001@gmail.com',
  username: 'test0001',
};

export const createUserFixture = (override?: Partial<typeof baseUserFixture>) => {
  return {
    ...baseUserFixture,
    ...override,
  };
};
