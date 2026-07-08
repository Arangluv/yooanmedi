import type { SearchParams } from 'nuqs/server';
import ClientOrderListPage from '@/views/client/order-list/ui/page';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const OrderListPage = async ({ searchParams }: PageProps) => {
  return <ClientOrderListPage searchParams={searchParams} />;
};

export default OrderListPage;
