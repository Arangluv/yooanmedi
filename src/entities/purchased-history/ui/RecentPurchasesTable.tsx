'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { formatNumberWithCommas } from '@/shared';
import { getPurchasedHistories } from '../api';

type RecentPurchasesTableProps = {
  user: number;
  product: number;
};

/** todo :: features layer 리팩토링 시 해당 코드도 수정필요 */

export const RecentPurchasesTable = ({ user, product }: RecentPurchasesTableProps) => {
  /** todo :: custom hook으로 개선 */
  const { data: result } = useQuery({
    queryKey: ['recent-purchased-history', user, product],
    queryFn: () => getPurchasedHistories({ user, product }),
  });

  if (!result || !result.isSuccess) {
    return null;
  }

  if (result.data.length === 0) {
    return null;
  }

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 w-[100px] flex-shrink-0">최근 구매내역</span>
      <table className="w-full">
        <thead>
          <tr className="border-foreground-200 border-1 bg-neutral-100 text-sm">
            <th className="border-foreground-200 border-r-1">구매일시</th>
            <th className="border-foreground-200 border-r-1">수량</th>
            <th>단가</th>
          </tr>
        </thead>
        <tbody>
          {result.data.map((item) => (
            <tr key={item.id} className="border-foreground-200 border-1 text-xs">
              <td className="border-foreground-200 border-r-1 py-1 text-center">
                {dayjs(item.createdAt).format('YYYY-MM-DD')}
              </td>
              <td className="border-foreground-200 border-r-1 text-center">{item.quantity}</td>
              <td className="text-center">{formatNumberWithCommas(item.amount)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
