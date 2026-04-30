import Link from 'next/link';

import { BrandLogo } from '@/shared';
import OrderLink from './OrderLink';
import { CartModalOpenTextButton } from '@/entities/cart';

const Navbar = () => {
  return (
    <header className="border-foreground-200 flex w-full items-center justify-center border-b-1 py-6">
      <div className="flex w-5xl items-center justify-between">
        <Link href="/order" prefetch={false}>
          <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
        </Link>
        <div className="flex gap-2">
          <CartModalOpenTextButton />
          <OrderLink />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
