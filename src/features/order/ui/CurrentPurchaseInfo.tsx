'use client';

import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import type { ProductItem } from '@/entities/product/@x/order';
import type { User } from '@/entities/user/@x/order';
import { formatNumberWithCommas } from '@/shared';

import { getCurrentUserOrder } from '../api/get-current-user-order';

const CurrentPurchaseInfo = ({ product, user }: { product: ProductItem; user: User }) => {
  const { data } = useQuery({
    queryKey: ['order-history', product.id],
    queryFn: () => getCurrentUserOrder({ prod_id: product.id, user_id: user.id }),
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
                {moment(item.orderCreatedAt).format('YYYY-MM-DD')}
              </td>
              <td className="border-foreground-200 border-r-1 text-center">{item.quantity}</td>
              {/* TODO :: isPayloadImageRenderable처럼 type 가드가 필요할 수 있습니다 */}
              {/* @ts-ignore */}
              <td className="text-center">{formatNumberWithCommas(item.product?.price)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentPurchaseInfo;
