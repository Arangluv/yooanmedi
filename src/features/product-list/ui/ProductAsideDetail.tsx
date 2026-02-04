'use client';

import Image from 'next/image';

import { Image as ImageIcon } from 'lucide-react';
import { Divider } from '@heroui/react';

import { CurrentPurchaseInfo } from '@/features/order';
import {
  EmptyProductDetail,
  DetailDefaultRow,
  DetailDeliveryFeeRow,
  DetailPointBenefitRow,
} from '@/entities/product';
import { useAuthStore } from '@/entities/user';
import { formatNumberWithCommas } from '@/shared';
import { isPayloadImageRenderable } from '@/shared';
import DetailQuantityInputRow from './DetailQuantityInputRow';
import useProductDetailStore from '../model/useProductDetailStore';

const ProductAsideDetail = () => {
  const { clieckedProduct } = useProductDetailStore();
  const { user } = useAuthStore();

  if (!clieckedProduct) {
    return <EmptyProductDetail />;
  }

  return (
    <div className="fixed top-[148px] right-0 flex w-[calc((100%-1024px)/2)] flex-col gap-8 px-8">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-lg bg-white p-4"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="mb-4 h-[150px] w-full overflow-hidden rounded-md bg-neutral-100">
            {isPayloadImageRenderable(clieckedProduct.image) ? (
              <Image
                src={clieckedProduct.image.url}
                alt={'상품 이미지'}
                width={150}
                height={150}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center gap-1">
                <ImageIcon className="text-foreground-300 h-6 w-6" strokeWidth={1.5} />
                <span className="text-foreground-600 text-sm">상품 이미지를 준비중입니다.</span>
              </div>
            )}
          </div>
          <DetailDefaultRow label="상품명" value={clieckedProduct.name} />
          <DetailDefaultRow label="제조사" value={clieckedProduct.manufacturer} />
          <DetailDefaultRow
            label="가격"
            value={`${formatNumberWithCommas(clieckedProduct.price)}원`}
          />
          <DetailDefaultRow label="규격" value={clieckedProduct.specification ?? ''} />
          <DetailDefaultRow label="보험코드" value={clieckedProduct.insurance_code ?? ''} />
          <DetailDeliveryFeeRow
            label="배송비"
            value={`${formatNumberWithCommas(clieckedProduct.delivery_fee)}원`}
            product={clieckedProduct}
          />
          <DetailDefaultRow
            label="재고"
            value={clieckedProduct.stock > 0 ? '재고 있음' : '재고 없음'}
            isAccent={clieckedProduct.stock > 0 ? true : false}
            variant={clieckedProduct.stock > 0 ? 'brand' : 'danger'}
          />
          <DetailDefaultRow
            label="반품가능여부"
            value={clieckedProduct.returnable ? '반품 가능' : '반품 불가능'}
            isAccent={clieckedProduct.returnable ? true : false}
            variant={clieckedProduct.returnable ? 'brand' : 'default'}
          />
          {/*TODO: AuthGuard를 사용하기때문에 반드시 user는 보장된다 하지만 typescript는 이를 모르는데 refactoring 필요 */}
          <CurrentPurchaseInfo product={clieckedProduct} user={user!} />
          <Divider className="my-2" />
          <DetailPointBenefitRow product={clieckedProduct} />
          <DetailQuantityInputRow />
        </div>
      </div>
    </div>
  );
};

export default ProductAsideDetail;
