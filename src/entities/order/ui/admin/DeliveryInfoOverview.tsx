import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/shadcn/card';

const DeliveryInfoOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">배송지 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex items-center justify-between">
            <span>배송지</span>
            <span className="font-medium">서울시 강남구 역삼동 123-123</span>
          </div>
          <div className="flex items-center justify-between">
            <span>배송 요청사항</span>
            <span className="font-medium">문 앞에 놓아주세요</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryInfoOverview;
