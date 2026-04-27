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
        <span className="flex items-center gap-1 text-2xl font-bold">
          <TriangleAlert className="h-5 w-5" />
          403 Forbidden
        </span>
        <span className="text-muted-foreground">{validateResult.message}</span>
        <Link
          href="/"
          className="bg-foreground hover:bg-secondary text-background w-fit rounded-md px-4 py-2 text-[15px] transition-colors duration-300"
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
