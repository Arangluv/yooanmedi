import Image from 'next/image'
import BrandLogoImage from '@public/v3_logo_full.png'

export function BrandLogo() {
  return (
    <div className="w-[140px] h-[40px]">
      <Image
        src={BrandLogoImage}
        alt="brand logo"
        width={140}
        height={40}
        unoptimized
        className="w-full h-full object-cover"
      />
    </div>
  )
}

export function HomeIcon() {
  return <div>홈</div>
}
