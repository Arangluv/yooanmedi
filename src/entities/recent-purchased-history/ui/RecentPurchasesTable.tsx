'use client';

import moment from 'moment';
import { useQuery } from '@tanstack/react-query';

import type { User } from '@/entities/user/@x/recent-purchased-history';
import type { ProductItem } from '@/entities/product/@x/recent-purchased-history';
import { formatNumberWithCommas } from '@/shared';

import { getRecentPurchasedHistory } from '../api/get-recent-purchased-history';

type RecentPurchasesTableProps = {
  user: User;
  product: ProductItem;
};

const RecentPurchasesTable = ({ user, product }: RecentPurchasesTableProps) => {
  const { data } = useQuery({
    queryKey: ['recent-purchased-history', user.id, product.id],
    queryFn: () => getRecentPurchasedHistory({ user, product }),
  });

  if (!data || data.length === 0) {
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
          {data?.map((item) => (
            <tr key={item.id} className="border-foreground-200 border-1 text-xs">
              <td className="border-foreground-200 border-r-1 py-1 text-center">
                {moment(item.createdAt).format('YYYY-MM-DD')}
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

export default RecentPurchasesTable;
