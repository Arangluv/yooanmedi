import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const OrderListTitle = () => {
  return (
    <div className="my-4 flex w-full items-center justify-between">
      <div className="">
        <span className="text-3xl font-bold">주문 내역</span>
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
