import { BrandLogo } from '@/config/Logo'
import Link from 'next/link'

/** components */
import SearchForm from './_components/main/SearchForm'
import SearchResultList from './_components/main/SearchResultList'
import Inventory from './_components/main/inventory/InventoryBottomButton'
import CategoryNav from './_components/main/CategoryNav'
import ProductList from './_components/main/ProductList'
import ProductDeatilAsideSection from './_components/main/ProductDeatilAsideSection'
import UserInfo from './_components/main/UserInfo'
import InventoryModal from './_components/main/inventory/InventoryModal'
import InventoryButtonAsLink from './_components/main/inventory/InventoryButtonAsLink'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductItemType, SearchParamsType } from './_type'
import { generateGetProductCondition } from './utils'

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>
}) {
  const serverSearchParams = await searchParams
  const getProductCondition = generateGetProductCondition({
    condition: serverSearchParams.condition,
    keyword: serverSearchParams.keyword,
    page: serverSearchParams.page,
    category: serverSearchParams.category,
  })

  const payload = await getPayload({ config })
  const { docs, totalPages, totalDocs } = await payload.find({
    collection: 'product',
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      cashback_rate: true,
      cashback_rate_for_bank: true,
      manufacturer: true,
      specification: true,
      insurance_code: true,
      stock: true,
      delivery_fee: true,
      returnable: true,
    },
    where: getProductCondition?.where,
    page: serverSearchParams.page ? parseInt(serverSearchParams.page) : 1,
    limit: 12,
  })

  return (
    <Wrapper>
      <div className="w-full flex bg-white z-10 py-6 sticky top-0">
        <div className="w-[calc((100%-1024px)/2)]" />
        <div className="w-5xl h-full">
          <header className="w-full h-full relative flex items-center justify-between">
            <Link href="/order" prefetch={false}>
              <BrandLogo width={140} height={40} className="w-[140px] h-[40px]" />
            </Link>
            {/* search area */}
            <SearchForm />
            <div className="flex gap-4 text-lg">
              <InventoryButtonAsLink />
              <Link href="/order/list" className="text-foreground-700">
                주문내역확인
              </Link>
            </div>
          </header>
        </div>
        {/* aside info */}
        <UserInfo />
      </div>
      {/* divider */}
      <div className="w-full h-[1px] bg-foreground-200 mb-4" />
      {/* bottom area */}
      <div className="w-full max-w-5xl flex items-center">
        {/* 제품카테고리 */}
        <CategoryNav />
      </div>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full">
        <div className="w-[calc((100%-1024px)/2)]"></div>
        {serverSearchParams.keyword ? (
          <SearchResultList
            products={docs as unknown as ProductItemType[]}
            totalPages={totalPages}
            condition={serverSearchParams.condition as 'pn' | 'cn'}
            totalProducts={totalDocs}
            keyword={serverSearchParams.keyword ?? ''}
          />
        ) : (
          <ProductList totalPages={totalPages} products={docs as unknown as ProductItemType[]} />
        )}
        <ProductDeatilAsideSection />
      </div>
      <Inventory />
      <InventoryModal />
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full items-center min-h-screen">
      <div className="w-full h-full flex flex-col items-center">{children}</div>
    </div>
  )
}
