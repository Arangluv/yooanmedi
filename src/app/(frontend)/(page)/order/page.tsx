import { BrandLogo } from '@/config/Logo';
import Link from 'next/link';

import type { SearchParams } from 'nuqs';

/** features */
import { getCustomPriceList } from '@/features/custom-price';
import {
  ProductSearchResultView,
  ProductDefaultView,
  ProductSearchForm,
  ProductCategotyNavigation,
  ProductAsideDetail,
} from '@/features/product-list';
import { InventoryModal, InventoryBtnAsLink, InventoryBottomBtn } from '@/features/inventory';

/** entities */
import { generateSearchParams, getProductCategory } from '@/entities/product';
import { UserInfo } from '@/entities/user';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function OrderPage({ searchParams }: PageProps) {
  const serverSearchParams = await generateSearchParams(searchParams);

  const { productList, totalProductPages, totalProductDocs } =
    await getCustomPriceList(serverSearchParams);

  // TODO: 개선 필요할 수도 있음
  const productCategory = await getProductCategory();

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
            <ProductSearchForm />
            <div className="flex gap-4 text-lg">
              <InventoryBtnAsLink />
              <Link href="/order/list" className="text-foreground-700">
                주문내역확인
              </Link>
            </div>
          </header>
        </div>
        {/* aside info */}
        <div className="w-[calc((100%-1024px)/2)]">
          <UserInfo />
        </div>
      </div>
      {/* divider */}
      <div className="bg-foreground-200 mb-4 h-[1px] w-full" />
      {/* bottom area */}
      <div className="flex w-full max-w-5xl items-center">
        {/* 제품카테고리 */}
        <ProductCategotyNavigation categories={productCategory} />
      </div>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full">
        <div className="w-[calc((100%-1024px)/2)]"></div>
        {serverSearchParams.keyword ? (
          <ProductSearchResultView
            products={productList}
            totalPages={totalProductPages}
            totalProducts={totalProductDocs}
            condition={serverSearchParams.condition as 'pn' | 'cn'}
            keyword={serverSearchParams.keyword ?? ''}
          />
        ) : (
          <ProductDefaultView products={productList} totalPages={totalProductPages} />
        )}
        <ProductAsideDetail />
      </div>
      <InventoryBottomBtn />
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
