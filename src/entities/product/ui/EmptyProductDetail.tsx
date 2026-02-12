import { ImageIcon } from 'lucide-react';

const EmptyProductDetail = () => {
  return (
    <div className="fixed top-[148px] right-0 flex w-[calc((100%-1024px)/2)] flex-col gap-8 px-8">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-lg bg-white p-4"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="mb-4 flex h-[150px] w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
            <ImageIcon className="text-foreground-200 h-6 w-6" />
            <span className="text-foreground-600 text-sm">상품을 선택해주세요.</span>
          </div>
          <EmptyProductDetailRow name="상품명" />
          <EmptyProductDetailRow name="제조사" />
          <EmptyProductDetailRow name="규격" />
          <EmptyProductDetailRow name="가격" />
          <EmptyProductDetailRow name="보험코드" />
          <EmptyProductDetailRow name="재고" />
        </div>
      </div>
    </div>
  );
};

const EmptyProductDetailRow = ({ name }: { name: string }) => {
  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{name}</span>
    </div>
  );
};

export default EmptyProductDetail;
