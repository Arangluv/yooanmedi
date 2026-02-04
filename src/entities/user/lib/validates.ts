import type { User } from '../model/type';

type CheckAuthValidateSuccessResult = {
  isValid: boolean;
  user: User;
};

type CheckAuthValidateFailResult = {
  isValid: boolean;
  message: string;
  user: null;
};

type CheckAuthValidateResult = CheckAuthValidateSuccessResult | CheckAuthValidateFailResult;

export const checkAuthValidate = (user: User | null): CheckAuthValidateResult => {
  if (!user) {
    return {
      isValid: false,
      message: '로그인 후 이용할 수 있습니다',
      user: null,
    };
  }

  if (!user.isApproved) {
    return {
      isValid: false,
      message: '아직 회원가입이 승인되지 않았습니다',
      user: null,
    };
  }

  return {
    isValid: true,
    user: user,
  };
};
