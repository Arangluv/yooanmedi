import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '../globals.css';
import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import clsx from 'clsx';
import { Toaster } from 'sonner';
import { Check, Info } from 'lucide-react';
import { Footer } from '@/widget/Footer';
import { getPopup, PopupModal } from '@/entities/popup';
import { siteConfig } from '@/shared';
import { Providers } from './providers';
import QueryProvider from './query-provider';
import { TooltipProvider } from '@/shared/ui/shadcn/tooltip';

const { title, description, naverSiteVerification } = siteConfig;

export const metadata: Metadata = {
  title,
  description,
  other: {
    'naver-site-verification': naverSiteVerification,
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

const pretendard = localFont({
  src: [
    {
      path: '../../font/pretendard/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const popupResponse = await getPopup();

  return (
    <html lang="ko" className={pretendard.className}>
      <body className={clsx('text-foreground bg-background min-h-screen antialiased')}>
        <Providers>
          <QueryProvider>
            <TooltipProvider>
              <Toaster
                toastOptions={{
                  duration: 4000,
                  className: pretendard.className,
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
              <main>{children}</main>
              <Footer />
              <ReactQueryDevtools />
            </TooltipProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
