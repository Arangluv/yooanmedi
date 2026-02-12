export const ExistingProductToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">상품이 이미 담겨있습니다.</span>
    </div>
  );
};

export const AddedProductToast = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">상품을 장바구니에 {count}개 담았습니다.</span>
    </div>
  );
};

export const QuantityChangedToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">수량이 변경되었습니다.</span>
    </div>
  );
};
