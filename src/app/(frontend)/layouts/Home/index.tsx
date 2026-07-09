import '../../../globals.css';
import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import React from 'react';
import { Toaster } from 'sonner';
import { Check, Info } from 'lucide-react';
import { Footer } from '@/widget/Footer';
import { siteConfig } from '@/shared';
import { UIProvider, TanstackQueryProvider } from '../../providers';
import { getPopup, PopupModal } from '@/entities/popup';

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

const siteFont = localFont({
  src: [
    {
      path: '../../../assets/font/pretendard/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

interface LayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = async ({ children }: LayoutProps) => {
  const popupResponse = await getPopup();

  return (
    <html lang="ko" className={siteFont.className}>
      <body className="text-foreground bg-background min-h-screen antialiased">
        <UIProvider>
          <TanstackQueryProvider>
            <Toaster
              toastOptions={{
                duration: 4000,
                classNames: {
                  title: 'text-sm',
                  icon: 'bg-muted rounded-full !size-6 !flex !items-center !justify-center',
                  error: '!text-red-500',
                },
              }}
              position="bottom-center"
              icons={{
                success: <Check className="size-5 text-green-500" />,
                info: <Info className="text-primary size-4" />,
              }}
            />
            <PopupModal {...popupResponse} />
            {children}
            <Footer />
          </TanstackQueryProvider>
        </UIProvider>
      </body>
    </html>
  );
};
