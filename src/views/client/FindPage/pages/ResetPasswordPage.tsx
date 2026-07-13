import { ResetPasswordAlertCard, ResetPasswordForm } from '@/features/auth/reset-password';
import { FindAuthInfoTabs } from '../ui';

export const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">비밀번호 재설정 찾기</h1>
        <p className="text-muted-foreground">
          회원가입 시 등록한 정보를 입력하여 비밀번호를 재설정 할 수 있습니다
        </p>
      </div>
      <FindAuthInfoTabs pageType="password" />
      <ResetPasswordAlertCard />
      <ResetPasswordForm />
    </div>
  );
};
