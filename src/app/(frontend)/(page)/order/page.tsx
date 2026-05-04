import type { SearchParams } from 'nuqs';
import Link from 'next/link';
import { BrandLogo } from '@/shared';
import OrderLink from '@/entities/order/ui/OrderLink';
import { CartModal, CartModalOpenTextButton, CartModalOpenBottomButton } from '@/entities/cart';
import { getProductCategories } from '@/entities/product';
import {
  ProductSearchForm,
  ProductCategotyNavigation,
  ProductAsideDetail,
  ProductListView,
  getProductList,
} from '@/features/product-list';
import { ProductListService } from '@/features/product-list/infrastructure';

export default async function OrderPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [productListResponse, categories] = await Promise.all([
    await getProductList(searchParams),
    await getProductCategories(),
  ]);

  // TODO :: EndPointResult에서 isSuccess가 false인 경우에 대한 UI처리를 고민해봐야한다
  if (!productListResponse.isSuccess || !categories.isSuccess) {
    throw new Error('상품리스트를 가져오는데 문제가 발생했습니다');
  }

  const safeSearchParam = await ProductListService.getSafeSearchParams(searchParams);

  return (
    <Wrapper>
      <div className="sticky top-0 z-10 flex w-full justify-center bg-white py-4">
        <div className="h-full w-5xl">
          <header className="relative flex h-full w-full items-center justify-between">
            <Link href="/order" prefetch={false}>
              <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
            </Link>
            {/* search area */}
            <ProductSearchForm />
            <div className="flex gap-2">
              <CartModalOpenTextButton />
              <OrderLink />
            </div>
          </header>
        </div>
      </div>
      {/* divider */}
      <div className="bg-foreground-200 mb-4 h-[1px] w-full" />
      {/* bottom area */}
      <div className="flex w-full max-w-5xl items-center">
        {/* 제품카테고리 */}
        <ProductCategotyNavigation categories={categories.data} />
      </div>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full">
        <div className="w-[calc((100%-1024px)/2)]"></div>
        <ProductListView
          products={productListResponse.data.products}
          totalCount={productListResponse.data.totalCount}
          condition={safeSearchParam.condition}
          keyword={safeSearchParam.keyword}
          opt={safeSearchParam.opt}
        />
        <ProductAsideDetail />
      </div>
      <CartModalOpenBottomButton />
      <CartModal />
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
