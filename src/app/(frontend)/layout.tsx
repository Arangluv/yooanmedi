import { Metadata, Viewport } from 'next';
import { siteConfig } from '@/shared';
import { HomeLayout } from './layouts/Home';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  other: {
    'naver-site-verification': siteConfig.naverSiteVerification,
  },
};

export const viewport: Viewport = {
  width: 1280,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default HomeLayout;
