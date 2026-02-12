import Link from 'next/link';
import { CircleAlert } from 'lucide-react';

const PaymentsFail = ({ message }: { message: string }) => {
  return (
    <div className="flex h-[calc(100vh-469px)] w-full flex-col items-center justify-center gap-4 py-12">
      <span className="text-danger-400 flex items-center gap-1 text-lg font-bold">
        <CircleAlert className="h-6 w-6" />
        주문을 처리하는데 실패했습니다
      </span>
      <span>사유 : {message}</span>
      <Link
        href="/order"
        className="text-hover:bg-brandWeek bg-brand mt-8 rounded-md px-4 py-2 text-[15px] text-white transition-colors duration-300"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default PaymentsFail;
