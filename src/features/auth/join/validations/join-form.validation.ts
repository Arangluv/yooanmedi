import { z } from 'zod';
import {
  requiredUserIdValidation,
  requiredPasswordValidation,
  requiredHospitalNameValidation,
  requiredCeoValidation,
  requiredBusinessNumberValidation,
  requirednursingNumberValidation,
  doctorLicenseNumberValidation,
  requiredPhoneNumberValidation,
  faxNumberValidation,
  requiredEmail,
  managerNumberValidation,
  requiredAddressValidation,
  requiredAddressDetailValidation,
  requiredFileValidation,
  requiredTermsAgree,
  requiredPrivacyPolicyAgree,
} from '@/shared/core';

export const joinFormValidation = z
  .object({
    id: requiredUserIdValidation,
    password: requiredPasswordValidation,
    passwordConfirm: requiredPasswordValidation,
    hospitalName: requiredHospitalNameValidation,
    ceo: requiredCeoValidation,
    businessNumber: requiredBusinessNumberValidation,
    nursingNumber: requirednursingNumberValidation,
    doctorLicenseNumber: doctorLicenseNumberValidation,
    phoneNumber: requiredPhoneNumberValidation,
    faxNumber: faxNumberValidation,
    email: requiredEmail,
    managerNumber: managerNumberValidation,
    address: requiredAddressValidation,
    addressDetail: requiredAddressDetailValidation,
    file: requiredFileValidation,
    termsAgree: requiredTermsAgree,
    privacyPolicyAgree: requiredPrivacyPolicyAgree,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  })
  .refine((data) => data.termsAgree, {
    message: '이용약관에 동의해주세요',
    path: ['termsAgree'],
  })
  .refine((data) => data.privacyPolicyAgree, {
    message: '개인정보 처리방침에 동의해주세요',
    path: ['privacyPolicyAgree'],
  });
