import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { User as UserIcon } from 'lucide-react';
import { BaseError, BrandLogo } from '@/shared';
import { TextWithIconAlignVerticalLink } from '@/shared/ui';
import OrderLink from '@/entities/order/ui/OrderLink';
import { getProductCategoriesApi } from '@/entities/product';
import {
  CartDetailModal,
  CartDetailModalOpenTextButton,
  CartDetailModalOpenBottomButton,
} from '@/features/cart-detail';
import {
  getProductListApi,
  getRankingProductListApi,
  ProductSearchForm,
  ProductCategotyNavigation,
  ProductAsideDetail,
  ProductListView,
} from '@/features/product-list';
import { ProductListSearchParamsGenerator } from '@/features/product-list/infrastructure';
import { ProductListHydrator } from '@/features/product-list';

type Props = {
  searchParams: Promise<SearchParams>;
};

export const OrderPage = async ({ searchParams }: Props) => {
  const safeSearchParams = await ProductListSearchParamsGenerator.getSafeSearchParams(searchParams);

  const [productListResponse, rankingResponse, categoriesResponse] = await Promise.all([
    getProductListApi(safeSearchParams),
    getRankingProductListApi(),
    getProductCategoriesApi(),
  ]);

  // TODO :: 상태에 따른 UI처리 분기 고민 -> ErrorBoundary, error.ts, suspense -> 명시적으로 해결
  if (
    !productListResponse.isSuccess ||
    !rankingResponse.isSuccess ||
    !categoriesResponse.isSuccess
  ) {
    throw new BaseError({
      clientMsg: '페이지를 불러오는데 문제가 발생했습니다',
      errorName: 'OrderPageError',
    });
  }

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center">
      <div className="flex h-full w-full flex-col items-center">
        {' '}
        <ProductListHydrator
          searchParams={safeSearchParams}
          initialData={{
            list: productListResponse,
            ranking: rankingResponse,
          }}
        >
          <div className="sticky top-0 z-10 flex w-full justify-center bg-white py-4">
            <div className="h-full w-5xl">
              <header className="relative flex h-full w-full items-center justify-between">
                <Link href="/order" prefetch={false}>
                  <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
                </Link>
                {/* search area */}
                <ProductSearchForm />
                <div className="flex gap-2">
                  <CartDetailModalOpenTextButton />
                  <OrderLink />
                  <TextWithIconAlignVerticalLink
                    icon={<UserIcon className="size-6" strokeWidth={1.5} />}
                    text="마이페이지"
                    href="/mypage/info"
                  />
                </div>
              </header>
            </div>
          </div>
          {/* divider */}
          <div className="bg-foreground-200 mb-4 h-[1px] w-full" />
          {/* bottom area */}
          <div className="flex w-full max-w-5xl items-center">
            {/* 제품카테고리 */}
            <ProductCategotyNavigation categories={categoriesResponse.data} />
          </div>
          {/* 메인 컨텐츠 영역 */}
          <div className="flex w-full">
            <div className="w-[calc((100%-1024px)/2)]"></div>
            <ProductListView
              products={productListResponse.data.products}
              totalCount={productListResponse.data.totalCount}
              condition={safeSearchParams.condition}
              keyword={safeSearchParams.keyword}
              opt={safeSearchParams.opt}
            />
            <ProductAsideDetail />
          </div>
          <CartDetailModalOpenBottomButton />
          <CartDetailModal />
        </ProductListHydrator>
      </div>
    </div>
  );
};
