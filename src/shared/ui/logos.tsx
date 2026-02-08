import BrandLogoImage from '@public/v1_logo_full.png';
import LogoSmall from '@public/v1_logo_small.png';

import Image from 'next/image';
import { Home } from 'lucide-react';

const BrandLogo = ({
  width = 140,
  height = 40,
  className = '',
}: {
  width: number;
  height: number;
  className: string;
}) => {
  return (
    <div className={className}>
      <Image src={BrandLogoImage} alt="brand logo" width={width} height={height} unoptimized />
    </div>
  );
};

const BrandLogoSmall = ({
  width = 100,
  height = 100,
  className = '',
}: {
  width: number;
  height: number;
  className: string;
}) => {
  return (
    <div className={className}>
      <Image src={LogoSmall} alt="brand logo" width={width} height={height} unoptimized />
    </div>
  );
};

const HomeIcon = () => {
  return <Home className="text-foreground-600 h-5 w-5" />;
};

export { BrandLogo, BrandLogoSmall, HomeIcon };
