import { z } from 'zod';

export const requiredUserIdValidation = z
  .string('아이디를 입력해주세요')
  .min(4, '아이디는 4글자 이상 입력해주세요');

export const requiredPasswordValidation = z
  .string('비밀번호를 입력해주세요')
  .min(5, '비빌번호는 5글자 이상 입력해주세요')
  .max(25, '비밀번호는 25글자 이하여야 합니다');

export const requiredHospitalNameValidation = z
  .string('상호명을 입력해주세요')
  .refine((val) => val !== '', '상호명을 입력해주세요');

export const requiredCeoValidation = z
  .string('대표자명을 입력해주세요')
  .refine((val) => val !== '', '대표자명을 입력해주세요');

export const requiredBusinessNumberValidation = z
  .string('사업자 등록번호를 입력해주세요')
  .refine((val) => !isNaN(parseInt(val)), '잘못된 사업자 등록번호 형식입니다');

export const requirednursingNumberValidation = z
  .string('요양기관번호를 입력해주세요')
  .refine((val) => !isNaN(parseInt(val)), '잘못된 요양기관번호 형식입니다');

export const doctorLicenseNumberValidation = z.string().transform((val) => val || '');

export const requiredPhoneNumberValidation = z.string('휴대폰 인증을 진행해주세요');

export const faxNumberValidation = z.string().transform((val) => val || '');

export const managerNumberValidation = z.string().transform((val) => val || '');

export const requiredAddressValidation = z.string('주소를 검색해서 입력해주세요');
export const requiredAddressDetailValidation = z
  .string('상세주소를 입력해주세요')
  .refine((val) => !isNaN(parseInt(val)), '상세주소를 입력해주세요');

export const requiredFileValidation = z
  .file('사업자등록증을 업로드해주세요')
  .min(1)
  .max(1024 * 1024 * 25, '최대 25MB 파일만 업로드할 수 있습니다. 다른 파일을 업로드해주세요');

export const requiredTermsAgree = z.literal(true, '이용약관에 동의해주세요');
export const requiredPrivacyPolicyAgree = z.literal(true, '개인정보 처리방침에 동의해주세요');
