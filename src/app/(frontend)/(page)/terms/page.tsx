import { getPayload } from 'payload'
import Navbar from '../../_components/Navbar'
import Link from 'next/link'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { ContentRenderer } from '@/components/ui/content-renderer'

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>
}) {
  const { type } = await searchParams

  if (!type || (type !== 'terms' && type !== 'privacy')) {
    return notFound()
  }
  // test

  const payload = await getPayload({ config: config })
  const { content } = await payload.findGlobal({
    slug: type === 'terms' ? 'terms' : 'privacy-policy',
  })

  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="w-full max-w-5xl">
        <Navbar />
      </div>
      <div className="w-full h-[1px] bg-foreground-200 mb-8"></div>
      <div className="w-full max-w-5xl flex flex-col">
        <ul className="flex items-center w-full mb-12">
          <li className='after:content-[">"] after:mx-2 after:text-sm'>
            <Link
              href="/"
              className="text-foreground-600 hover:text-foreground-800 transition-colors duration-300 text-sm"
            >
              홈
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="text-foreground-700 hover:text-foreground-800 transition-colors duration-300 text-sm"
            >
              {type === 'terms' ? '이용약관' : '개인정보처리방침'}
            </Link>
          </li>
        </ul>
        <section className="w-full mb-12">
          <ContentRenderer content={content} />
        </section>
      </div>
    </div>
  )
}
