import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/shadcn/card';

const OrderUserOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">주문자 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <span>김철수</span>
          <span>010-1234-5678</span>
          <span>ruhunsu3@naver.com</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderUserOverview;
