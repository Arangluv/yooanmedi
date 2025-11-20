'use client'

import Link from 'next/link'
import { LogoContext } from '@/context/design_contexts'
import { useContext } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const { logoImage } = useContext(LogoContext)

  return (
    <div className="w-full flex justify-center items-center h-[72px]">
      <nav className="w-full h-full max-w-7xl flex items-center">
        <div className="w-[140px] h-[40px] flex justify-center items-center">
          <h1 className="sr-only">유안메디팜</h1>
          <Link href="/" className="w-[140px] h-[40px] flex justify-center items-center">
            <Image
              src={logoImage}
              alt="유안메디팜"
              width={140}
              height={40}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </nav>
    </div>
  )
}
