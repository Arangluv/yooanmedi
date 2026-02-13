'use client';

import useAuthStore from '@/entities/user/model/useAuthStore';
import { formatNumberWithCommas } from '@/shared';

const LayoutTopNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="bg-muted flex w-full items-center justify-center py-2">
      <div className="flex w-full max-w-5xl items-center justify-end gap-2">
        <span className="text-secondary text-[13px] font-bold">
          {user.hospitalName} <span className="text-muted-foreground font-normal">님</span>
        </span>
        <span className="text-muted-foreground text-[13px]">|</span>
        <span className="text-muted-foreground text-[13px]">
          보유 적립금 :{' '}
          <span className="text-secondary font-bold">
            {formatNumberWithCommas(user.point ?? 0)}원
          </span>
        </span>
        <span className="text-muted-foreground text-[13px]">|</span>
        <button onClick={logout} className="text-muted-foreground cursor-pointer text-[13px]">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default LayoutTopNavbar;
