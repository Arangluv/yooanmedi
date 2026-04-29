import { BrandLogo } from '@/shared';
import Link from 'next/link';
import type { SearchParams } from 'nuqs';
import {
  ProductSearchForm,
  ProductCategotyNavigation,
  ProductAsideDetail,
  ProductListView,
} from '@/features/product-list';
import { ProductListService } from '@/features/product-list/infrastructure';
import { ProductRepository } from '@/entities/product/infrastructure';
import OrderLink from '@/entities/order/ui/OrderLink';
import { CartModal, CartModalOpenTextButton, CartModalOpenBottomButton } from '@/entities/cart';

export default async function OrderPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const productListService = new ProductListService();
  const [productListResponse, categories] = await Promise.all([
    await productListService.getProductListAppliedCustomPrice(searchParams),
    await ProductRepository.findAllCategories(),
  ]);

  const safeSearchParam = await productListService.getSafeSearchParams(searchParams);

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
        <ProductCategotyNavigation categories={categories} />
      </div>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex w-full">
        <div className="w-[calc((100%-1024px)/2)]"></div>
        <ProductListView
          products={productListResponse.products}
          totalCount={productListResponse.totalCount}
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
