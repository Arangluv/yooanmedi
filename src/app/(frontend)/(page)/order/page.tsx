import Image from 'next/image'
import { BrandLogo } from '@/config/Logo'
import Link from 'next/link'
import SearchForm from './_components/main/SearchForm'
import MainIconImage1 from '@public/order/main-icon-1.png'
import MainIconImage2 from '@public/order/main-icon-2.png'
import MainIconImage3 from '@public/order/main-icon-3.png'
import ProductList from './_components/main/ProductList'
import SearchResultList from './_components/main/SearchResultList'

export default async function OrderPage() {
  return (
    <div className="flex flex-col w-full h-full items-center">
      <Order />
    </div>
  )
}

function Order() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white z-10 py-6">
        <header className="w-full h-full relative">
          <Link href="/order" prefetch={false}>
            <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
          </Link>
          {/* search area */}
          <SearchForm />
        </header>
      </div>
      {/* divider */}
      <div className="w-full h-[1px] bg-foreground-200 my-6"></div>
      {/* bottom area */}
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between w-full">
          {/* 제품카테고리 */}
          <div className="flex gap-6">
            <Link
              href="/order"
              className="flex gap-1 items-center hover:text-brandWeek transition-colors duration-300"
            >
              <Image
                src={MainIconImage1}
                alt="의약품"
                width={26}
                height={26}
                className="w-[26px] h-[26px] object-contain"
              />
              <span>의약품</span>
            </Link>
            <Link
              href="/order"
              className="flex gap-1 items-center hover:text-brandWeek transition-colors duration-300"
            >
              <Image
                src={MainIconImage2}
                alt="주사"
                width={26}
                height={26}
                className="w-[26px] h-[26px] object-contain"
              />
              <span>주사</span>
            </Link>
            <Link
              href="/order"
              className="flex gap-1 items-center hover:text-brandWeek transition-colors duration-300"
            >
              <Image
                src={MainIconImage3}
                alt="에스테틱"
                width={26}
                height={26}
                className="w-[26px] h-[26px] object-contain"
              />
              <span>에스테틱</span>
            </Link>
          </div>
          {/* 주문서확인 및 주문하기 */}
          <div className="flex gap-6 text-lg">
            <Link href="/order" className="text-brandWeek font-bold">
              약품주문
            </Link>
            <Link href="/order/history" className="text-foreground-600">
              주문내역확인
            </Link>
          </div>
        </div>
      </div>
      <ProductList />
    </div>
  )
}

function ProductListSection() {
  return <div className="w-full flex flex-col"></div>
}
