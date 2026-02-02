import { BrandLogo } from '@/config/Logo';
import Link from 'next/link';

/** components */
import SearchForm from './_components/main/SearchForm';
import SearchResultList from './_components/main/SearchResultList';
import Inventory from './_components/main/inventory/InventoryBottomButton';
import CategoryNav from './_components/main/CategoryNav';
import ProductList from './_components/main/ProductList';
import ProductDeatilAsideSection from './_components/main/ProductDeatilAsideSection';
import UserInfo from './_components/main/UserInfo';
import InventoryModal from './_components/main/inventory/InventoryModal';
import InventoryButtonAsLink from './_components/main/inventory/InventoryButtonAsLink';
import { ProductItemType } from './_type';
import { headers as nextHeaders } from 'next/headers';

/** entities */
import type { SearchParamsType } from '@/entities/product/lib/generate-condition';
import { getProductList } from '@/entities/product/api/get-product-list';

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const nextHeader = await nextHeaders();
  const serverSearchParams = await searchParams;

  const { productList, totalProductPages, totalProductDocs } =
    await getProductList(serverSearchParams);

  // const payloadAuthResult = await payload.auth({ headers: nextHeader, canSetHeaders: false });

  // const { docs: customPriceDocs } = await payload.find({
  //   collection: 'product-price',
  //   select: {
  //     product: true,
  //   },
  //   populate: {
  //     product: {
  //       price: true,
  //     },
  //   },
  //   where: {
  //     user: {
  //       equals: payloadAuthResult.user?.id,
  //     },
  //   },
  // });

  return (
    <Wrapper>
      <div className="sticky top-0 z-10 flex w-full bg-white py-6">
        <div className="w-[calc((100%-1024px)/2)]" />
        <div className="h-full w-5xl">
          <header className="relative flex h-full w-full items-center justify-between">
            <Link href="/order" prefetch={false}>
              <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
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
      <div className="bg-foreground-200 mb-4 h-[1px] w-full" />
      {/* bottom area */}
      <div className="flex w-full max-w-5xl items-center">
        {/* 제품카테고리 */}
        <CategoryNav />
      </div>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full">
        <div className="w-[calc((100%-1024px)/2)]"></div>
        {serverSearchParams.keyword ? (
          <SearchResultList
            products={productList as unknown as ProductItemType[]}
            totalPages={totalProductPages}
            condition={serverSearchParams.condition as 'pn' | 'cn'}
            totalProducts={totalProductDocs}
            keyword={serverSearchParams.keyword ?? ''}
          />
        ) : (
          <ProductList
            totalPages={totalProductPages}
            products={productList as unknown as ProductItemType[]}
          />
        )}
        <ProductDeatilAsideSection />
      </div>
      <Inventory />
      <InventoryModal />
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center">
      <div className="flex h-full w-full flex-col items-center">{children}</div>
    </div>
  );
}
