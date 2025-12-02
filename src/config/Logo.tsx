import Image from 'next/image'
import BrandLogoImage from '@public/v1_logo_full.png'
import LogoSmall from '@public/v1_logo_small.png'
import { Home } from 'lucide-react'

export function BrandLogo({
  width = 140,
  height = 40,
  className = '',
}: {
  width: number
  height: number
  className: string
}) {
  return (
    <div className={className}>
      <Image src={BrandLogoImage} alt="brand logo" width={width} height={height} unoptimized />
    </div>
  )
}

export function BrandLogoSmall({
  width = 100,
  height = 100,
  className = '',
}: {
  width: number
  height: number
  className: string
}) {
  return (
    <div className={className}>
      <Image src={LogoSmall} alt="brand logo" width={width} height={height} unoptimized />
    </div>
  )
}

export function HomeIcon() {
  return <Home className="w-5 h-5 text-foreground-600" />
}
