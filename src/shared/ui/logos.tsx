import Image from 'next/image';
import { Home } from 'lucide-react';

export const LOGO_FULL = '/v1_logo_full.png';
export const LOGO_SMALL = '/v1_logo_small.png';

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
      <Image src={LOGO_FULL} alt="brand logo" width={width} height={height} unoptimized />
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
      <Image src={LOGO_SMALL} alt="brand logo" width={width} height={height} unoptimized />
    </div>
  );
};

const HomeIcon = () => {
  return <Home className="text-foreground-600 h-5 w-5" />;
};

export { BrandLogo, BrandLogoSmall, HomeIcon };
