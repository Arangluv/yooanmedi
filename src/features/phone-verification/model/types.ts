import type { MokResultDto } from '../lib/payload-decode';

export type PhoneVerificationResult =
  | {
      success: true;
      data: Pick<MokResultDto, 'userPhone' | 'userName' | 'userBirthday' | 'userGender'>;
    }
  | {
      success: false;
      error: string;
    };
