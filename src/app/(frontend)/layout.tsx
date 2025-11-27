import React from 'react'
import '../globals.css'
import { Providers } from './providers'
import { Metadata, Viewport } from 'next'
import clsx from 'clsx'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import localFont from 'next/font/local'
import Navbar from './_components/Navbar'
import BannerSection from './_components/BannerSection'
import Footer from './_components/Footer'
import { DesignProvider, LogoProvider } from '@/context/design_contexts'
import NoticeHeader from './_components/NoticeHeader'
import { Toaster } from 'sonner'
import { Check, Info } from 'lucide-react'
import Popup from './_components/Popup'
import QueryProvider from './query-provider'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '유안메디팜 | 의약품 이커머스 플랫폼',
  description: '의약품 전문몰 유안메디팜 주문부터 배송까지 한번에',
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
                    duration: 3000,
                    classNames: {
                      title: '!text-foreground-800 !font-medium',
                      description: '!text-foreground-700',
                    },
                  }}
                  position="bottom-center"
                  icons={{
                    success: <Check className="w-4 h-4 text-brandWeek" />,
                    info: <Info className="w-4 h-4 text-brandWeek" />,
                  }}
                />
                {/* <Popup popup={popup} /> */}
                {/* <NoticeHeader /> */}
                <main className="overflow-x-hidden">{children}</main>
                <Footer />
              </LogoProvider>
            </DesignProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  )
}
