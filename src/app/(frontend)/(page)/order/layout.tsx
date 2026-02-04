import { getMinOrderPrice } from './actions';
import {
  InventoryModalProvider,
  InventoryProvider,
  MinOrderPriceProvider,
  ProductInfoProvider,
} from './_context/order_context';
import { getUserByHeader } from '@/entities/user';
import { AuthGuard } from '@/entities/user';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserByHeader();
  const minOrderPrice = await getMinOrderPrice();

  return (
    <AuthGuard user={user}>
      <InventoryModalProvider>
        <ProductInfoProvider>
          <InventoryProvider>
            <MinOrderPriceProvider initialMinOrderPrice={minOrderPrice}>
              {children}
            </MinOrderPriceProvider>
          </InventoryProvider>
        </ProductInfoProvider>
      </InventoryModalProvider>
    </AuthGuard>
  );
}
