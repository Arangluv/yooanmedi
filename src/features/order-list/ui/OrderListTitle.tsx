import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const OrderListTitle = () => {
  return (
    <div className="mt-4 flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold">주문 내역</span>
        <span className="text-foreground-500">고객님의 주문 정보를 확인하실 수 있습니다</span>
      </div>
      <div className="flex items-center gap-1">
        <Link href="/order" className="text-foreground-600">
          상품조회
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-brand font-bold">주문내역</span>
      </div>
    </div>
  );
};

export default OrderListTitle;
