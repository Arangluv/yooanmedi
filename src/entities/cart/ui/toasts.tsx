// TODO :: 공통화 리팩토링 진행하기
export const ErrorCartToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">장바구니에 상품을 담는데 문제가 발생했습니다</span>
    </div>
  );
};

export const ExistingCartToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">상품이 이미 담겨있습니다.</span>
    </div>
  );
};

export const AlreadyRemoveCartToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">이미 장바구니에서 제거되었습니다</span>
    </div>
  );
};

export const RemoveCartItemToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">장바구니에서 삭제했습니다</span>
    </div>
  );
};

export const UpdateCartItemToast = () => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">수량을 업데이트 했습니다</span>
    </div>
  );
};

export const AddedCartToast = ({ count = 1 }: { count?: number }) => {
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
