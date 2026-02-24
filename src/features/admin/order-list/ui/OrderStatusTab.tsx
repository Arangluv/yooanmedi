import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order/constants/order-status';

const OrderStatusTab = () => {
  return (
    <div className="bg-muted w-full rounded-lg p-4">
      <Tabs defaultValue="all">
        <TabsList variant="line">
          <TabsTrigger value="all" className="text-base">
            전체
          </TabsTrigger>
          {Object.values(ORDER_STATUS).map((status) => (
            <TabsTrigger key={status} value={status} className="text-base">
              {ORDER_STATUS_NAME[status]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrderStatusTab;
