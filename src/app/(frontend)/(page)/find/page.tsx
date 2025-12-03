import { BrandLogo } from '@/config/Logo'
import FindTabs from './_components/FindTabs'
import { notFound } from 'next/navigation'
import FindPassword from './_components/FindPassword'
import FindId from './_components/FindId'
import { Info } from 'lucide-react'
import Link from 'next/link'

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>
}) {
  const { type } = await searchParams

  if (!type || (type !== 'id' && type !== 'password')) {
    return notFound()
  }

  return (
    <section className="w-full flex items-center justify-center py-12">
      <div className="w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-center items-center mb-8">
          <Link href="/" className="w-full flex justify-center">
            <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground-900">아이디 비밀번호 찾기</h1>
        </div>
        <div className="flex flex-col w-full rounded-2xl py-12 px-8 gap-6">
          <FindTabs />
          {/* alert */}
          <div className="flex items-center gap-4 w-full p-4 bg-neutral-50 rounded-md mb-4">
            <Info className="w-5 h-5 text-foreground-500" />
            <div className="flex flex-col gap-1">
              <span className="text-foreground-500 text-sm">
                <span className="text-brandWeek font-medium">비밀번호는 암호화되어 저장</span>되기
                때문에 <span className="text-brandWeek font-medium">재설정만 가능</span>합니다.
              </span>
              <span className="text-foreground-500 text-sm">
                기타 문의사항은 <span className="text-brandWeek font-medium">031-893-0806</span>으로
                문의 부탁드립니다.
              </span>
            </div>
          </div>
          {type === 'id' ? <FindId /> : <FindPassword />}
        </div>
      </div>
    </section>
  )
}
