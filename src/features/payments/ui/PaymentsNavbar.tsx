'use client';

import Link from 'next/link';

import { BrandLogo } from '@/shared';

import UserInfo from '@/entities/user/ui/UserInfo';

const PaymentsNavbar = () => {
  return (
    <header className="border-foreground-200 flex w-full items-center justify-center border-b-1 py-6">
      <div className="flex w-5xl items-center justify-between">
        <Link href="/order" prefetch={false}>
          <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
        </Link>
        {/* <UserInfo className="w-auto pr-0" /> */}
        <UserInfo />
      </div>
    </header>
  );
};

export default PaymentsNavbar;
