import Image from 'next/image'
import BrandLogoImage from '@public/v1_logo_full.png'

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

export function HomeIcon() {
  return <div>홈</div>
}
