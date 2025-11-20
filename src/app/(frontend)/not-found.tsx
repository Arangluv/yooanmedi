import Link from 'next/link'
import NotfoundImage from '@public/notfound.png'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="w-full flex justify-center items-center flex-col h-[calc(100vh-367px)]">
      <div className="w-full max-w-5xl flex flex-col gap-2 items-center text-center">
        <h1 className="sr-only">404 Not Found</h1>
        <div className="w-[300px] h-[300px]">
          <Image
            src={NotfoundImage}
            alt="404 Not Found"
            width={300}
            height={300}
            unoptimized
            className="w-full h-full object-cover"
          />
        </div>
        <p className="mb-2 text-foreground-600 text-[15px]">
          잘못된 요청이거나 페이지가 더이상 존재하지 않습니다
        </p>
        <Link
          className="text-white transition-colors duration-300 text-[15px] px-4 py-2 rounded-md bg-brand hover:bg-brandWeek w-fit"
          href="/"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
