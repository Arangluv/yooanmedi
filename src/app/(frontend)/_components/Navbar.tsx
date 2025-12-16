import Link from 'next/link'
import { BrandLogo } from '@/config/Logo'

export default function Navbar() {
  return (
    <div className="w-full flex justify-center items-center h-[72px]">
      <nav className="w-full h-full max-w-7xl flex items-center">
        <div className="w-[140px] h-[40px] flex justify-center items-center">
          <h1 className="sr-only">유안메디팜</h1>
          <Link href="/" className="w-[140px] h-[40px] flex justify-center items-center">
            <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
          </Link>
        </div>
      </nav>
    </div>
  )
}
