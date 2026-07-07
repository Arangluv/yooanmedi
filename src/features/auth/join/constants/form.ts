import type { JoinForm } from '../types';

export const DEFAULT_JOIN_FORM_VALUES: Partial<JoinForm> = {
  id: '',
  password: '',
  passwordConfirm: '',
  hospitalName: '',
  ceo: '',
  businessNumber: '',
  nursingNumber: '',
  doctorLicenseNumber: '',
  managerNumber: '',
  faxNumber: '',
  email: '',
  address: '',
  addressDetail: '',
  termsAgree: false,
  privacyPolicyAgree: false,
};
