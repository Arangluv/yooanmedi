'use client';

import { useAuthStore } from '@/entities/user';

const DeliveryInfo = () => {
  const { user } = useAuthStore();

  // TODO :: 보일러 플레이트 제거하기
  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xl font-bold">주문자 정보</span>
      <div className="flex w-full flex-col gap-1 rounded-lg bg-neutral-50 p-6">
        <div className="bg-brand mb-2 w-fit rounded-full px-3 py-1 text-xs text-white">
          기본배송지
        </div>
        <span className="text-foreground-700">{user.address}</span>
        <span className="text-foreground-700">{user.phoneNumber}</span>
        <span className="text-foreground-700">{user.email}</span>
      </div>
    </div>
  );
};

export default DeliveryInfo;
