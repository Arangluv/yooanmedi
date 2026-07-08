import { z } from 'zod';
import {
  requiredUserIdValidation,
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
  pointValidation,
} from '@/shared/core';

export const modifyUserInfoFormValidation = z.object({
  id: requiredUserIdValidation,
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
  point: pointValidation,
});
