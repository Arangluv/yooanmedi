import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/shadcn/card';

const PaymentsOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">결제 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex items-center justify-between">
            <span>결제 방법</span>
            <span className="font-medium">신용카드</span>
          </div>
          <div className="flex items-center justify-between">
            <span>결제 상태</span>
            <span className="font-medium">결제 완료</span>
          </div>
          <div className="flex items-center justify-between">
            <span>사용 포인트</span>
            <span className="font-medium">1,000원</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex w-full items-center justify-between text-lg">
          <span className="font-bold">총 결제 금액</span>
          <span className="font-bold">100,000원</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentsOverview;
