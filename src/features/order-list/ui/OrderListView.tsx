import OrderListTitle from './OrderListTitle';
import OrderListSearch from './OrderListSearch';
import OrderListTable from './OrderListTable';

const OrderListView = () => {
  return (
    <div className="flex min-h-[calc(100vh-415px)] w-full justify-center">
      <div className="flex w-5xl flex-col gap-4">
        <OrderListTitle />
        <OrderListSearch />
        <OrderListTable />
      </div>
    </div>
  );
};

export default OrderListView;
