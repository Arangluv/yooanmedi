'use client';

import useAuthStore from '../model/useAuthStore';

import { formatNumberWithCommas } from '@/shared';

const UserInfo = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full w-full justify-end pr-8">
      <div className="flex flex-col items-end justify-center">
        <span className="text-brandWeek">
          <span className="mr-1 font-bold">{user.hospitalName}</span>
          <span className="text-foreground-700">님</span>
        </span>
        <span className="text-foreground-600 text-sm">
          보유 적립금 :{' '}
          <span className="text-brandWeek font-bold">
            {formatNumberWithCommas(user.point ?? 0)}원
          </span>
        </span>
      </div>
    </div>
  );
};

export default UserInfo;
