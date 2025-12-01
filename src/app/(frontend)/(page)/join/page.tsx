import { BrandLogo } from '@/config/Logo'

export default function JoinPage() {
  return (
    <section className="w-full h-screen bg-neutral-50 flex items-center justify-center py-12">
      <div className="w-full max-w-2xl bg-white h-[300px] rounded-2xl flex flex-col">
        <div className="w-full">
          <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
        </div>
      </div>
    </section>
  )
}
