import Link from 'next/link';
import { BrandLogo } from '@/shared';

export default function Navbar() {
  return (
    <div className="flex h-[72px] w-full items-center justify-center">
      <nav className="flex h-full w-full max-w-7xl items-center">
        <div className="flex h-[40px] w-[140px] items-center justify-center">
          <h1 className="sr-only">유안메디팜</h1>
          <Link href="/" className="flex h-[40px] w-[140px] items-center justify-center">
            <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
