import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { getMinOrderPrice } from './actions';
import {
  InventoryModalProvider,
  InventoryProvider,
  MinOrderPriceProvider,
  ProductInfoProvider,
} from './_context/order_context';
import { getUserByHeader, AuthGuard } from '@/entities/user';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserByHeader();
  const minOrderPrice = await getMinOrderPrice();

  return (
    <AuthGuard user={user}>
      <NuqsAdapter>
        <InventoryModalProvider>
          <ProductInfoProvider>
            <InventoryProvider>
              <MinOrderPriceProvider initialMinOrderPrice={minOrderPrice}>
                {children}
              </MinOrderPriceProvider>
            </InventoryProvider>
          </ProductInfoProvider>
        </InventoryModalProvider>
      </NuqsAdapter>
    </AuthGuard>
  );
}
