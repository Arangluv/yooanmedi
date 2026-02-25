import FloatActionBox from './FloatActionBox';
import OrderStatusTab from './OrderStatusTab';
import OrderListTableSection from './table/OrderListTableSection';

const ListView = () => {
  return (
    <div className="bg-muted flex min-h-[calc(100vh-var(--app-header-height))] flex-col gap-8 px-[60px] py-[30px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">주문 내역</h1>
        <p className="text-muted-foreground">고객 주문현황을 확인 및 관리하실 수 있습니다</p>
      </div>
      <OrderStatusTab />
      <OrderListTableSection />
      <FloatActionBox />
    </div>
  );
};

export default ListView;
