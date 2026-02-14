import type { User } from '../model/type';

type CheckAuthValidateSuccessResult = {
  isValid: true;
  user: User;
};

type CheckAuthValidateFailResult = {
  isValid: false;
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

  if (user.role === 'admin') {
    return {
      isValid: false,
      message: '일반 유저만 접근할 수 있습니다',
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
