import Link from 'next/link';
import { BrandLogo } from '@/shared';

export const JoinHeader = () => {
  return (
    <div className="mb-8 flex flex-col items-center justify-center gap-4">
      <Link href="/" prefetch={false} className="flex w-full justify-center">
        <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
      </Link>
      <h1 className="text-foreground-900 text-3xl font-bold">회원가입</h1>
    </div>
  );
};
