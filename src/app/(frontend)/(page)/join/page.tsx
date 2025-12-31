import { BrandLogo } from '@/config/Logo'
import JoinForm from './_components/Form'
import Link from 'next/link'

export default function JoinPage() {
  return (
    <section className="w-full bg-neutral-50 flex items-center justify-center py-12">
      <div className="w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-center items-center mb-8">
          <Link href="/" prefetch={false} className="w-full flex justify-center">
            <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
          </Link>
          <h1 className="text-3xl font-bold text-foreground-900">회원가입</h1>
        </div>
        {/* Form */}
        <div className="bg-white flex flex-col w-full rounded-2xl  py-12 px-8 ">
          <JoinForm />
        </div>
      </div>
    </section>
  )
}
