import Link from 'next/link';

import UserInfo from '@/entities/user/ui/UserInfo';
import { BrandLogo } from '@/shared';

const Navbar = () => {
  return (
    <header className="border-foreground-200 flex w-full items-center justify-center border-b-1 py-6">
      <div className="flex w-5xl items-center justify-between">
        <Link href="/order" prefetch={false}>
          <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
        </Link>
        <UserInfo />
      </div>
    </header>
  );
};

export default Navbar;
