import Link from 'next/link'
import { BrandLogo } from '@/config/Logo'
import UserInfo from '@order/_components/main/UserInfo'

export default function OrderNavbar() {
  return (
    <header className="w-full flex items-center justify-center py-6 border-b-1 border-foreground-200">
      <div className="w-5xl flex items-center justify-between">
        <Link href="/order" prefetch={false}>
          <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
        </Link>
        <UserInfo className="w-auto pr-0" />
      </div>
    </header>
  )
}
