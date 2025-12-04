import React from 'react'
import '../globals.css'
import { Providers } from './providers'
import { Metadata, Viewport } from 'next'
import clsx from 'clsx'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import localFont from 'next/font/local'
import Footer from './_components/Footer'
import { DesignProvider, LogoProvider } from '@/context/design_contexts'
import { Toaster } from 'sonner'
import { Check, Info } from 'lucide-react'
import Popup from './_components/Popup'
import QueryProvider from './query-provider'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '유안메디팜',
  description:
    '의약품 전자상거래 전문업체 주사제 · 백신 · 흡입제 · 내복제 · 외용제 · 기타 · 수액제',
}

export const viewport: Viewport = {
  width: 1280,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

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
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payload = await getPayload({ config: configPromise })

  const [popup] = await Promise.all([payload.findGlobal({ slug: 'popup' })])

  return (
    <html lang="ko" className={pretendard.className}>
      <body className={clsx('min-h-screen text-foreground bg-background antialiased')}>
        <Providers>
          <QueryProvider>
            <DesignProvider>
              <LogoProvider>
                <Toaster
                  toastOptions={{
                    duration: 4000,
                  }}
                  position="bottom-center"
                  richColors
                  icons={{
                    success: <Check className="w-4 h-4 text-success-500" />,
                    info: <Info className="w-4 h-4 text-brandWeek" />,
                  }}
                />
                <Popup popup={popup} />
                <main>{children}</main>
                <Footer />
              </LogoProvider>
            </DesignProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  )
}
