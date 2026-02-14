import React from 'react';
import '../globals.css';
import { Providers } from './providers';
import { Metadata, Viewport } from 'next';
import clsx from 'clsx';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import localFont from 'next/font/local';
import Footer from './_components/Footer';
import { Toaster } from 'sonner';
import { Check, Info } from 'lucide-react';
import Popup from './_components/Popup';
import QueryProvider from './query-provider';
import { TooltipProvider } from '@/shared/ui/shadcn/tooltip';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export const metadata: Metadata = {
  title: '유안메디팜',
  description:
    '의약품 전자상거래 전문업체 주사제 · 백신 · 흡입제 · 내복제 · 외용제 · 기타 · 수액제',
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
  const payload = await getPayload({ config: configPromise });

  const [popup] = await Promise.all([payload.findGlobal({ slug: 'popup' })]);

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
              <Popup popup={popup} />
              <main>{children}</main>
              <Footer />
            </TooltipProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
