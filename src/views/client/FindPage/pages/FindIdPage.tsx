import { FindIdForm } from '@/features/auth/find-id';
import { FindAuthInfoTabs } from '../ui';

export const FindIdPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">아이디 찾기</h1>
        <p className="text-muted-foreground">
          회원가입 시 등록한 정보를 입력하여 아이디를 확인할 수 있습니다
        </p>
      </div>
      <FindAuthInfoTabs pageType="id" />
      <FindIdForm />
    </div>
  );
};
