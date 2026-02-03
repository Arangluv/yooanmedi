'use client';

import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import { getCurrentUserOrder } from '../api/get-current-user-order';
import { ProductItem } from '@/entities/product/model/types';
import { formatNumberWithCommas } from '@/shared/lib/fomatters';

const CurrentPurchaseInfo = ({ product }: { product: ProductItem }) => {
  const tempUserId = 1;

  const { data } = useQuery({
    queryKey: ['order-history', product.id, tempUserId],
    queryFn: () => getCurrentUserOrder({ prod_id: product.id, user_id: tempUserId }),
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
              {/* TODO : 아직 entities에서 order type을 제대로 정의하지 않았음 */}
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
