import Link from 'next/link';

import { TriangleAlert } from 'lucide-react';

import type { User } from './type';
import { checkAuthValidate } from '../lib/validates';
import { AuthStoreProvider } from './auth-store-provider';

type AuthGuardProps = {
  children: React.ReactNode;
  user: User | null;
};

const AuthGuard = ({ children, user }: AuthGuardProps) => {
  const validateResult = checkAuthValidate(user);

  if (!validateResult.isValid) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <span className="text-danger flex items-center gap-1 text-2xl font-bold">
          <TriangleAlert className="h-5 w-5" />
          403 Forbidden
        </span>
        <span>로그인 후 이용할 수 있습니다</span>
        <Link
          href="/"
          className="bg-brand hover:bg-brandWeek w-fit rounded-md px-4 py-2 text-[15px] text-white transition-colors duration-300"
        >
          홈으로 이동
        </Link>
      </div>
    );
  }

  return (
    <AuthStoreProvider initProps={{ user: validateResult.user }}>{children}</AuthStoreProvider>
  );
};

export default AuthGuard;
