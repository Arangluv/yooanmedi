import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { getUserByHeader, AuthGuard } from '@/entities/user';
import { getSiteMetadata, SiteMetadataSetter } from '@/shared';
import LayoutTopNavbar from '@/entities/order/ui/LayoutTopNavbar';
import InventoryModal from '@/features/inventory/ui/InventoryModal';
import { getFavoritesList } from '@/features/favorites-product/api/favorites-list';
import FavoritesProductInitProvider from '@/features/favorites-product/model/favorites-Init-provider';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserByHeader();
  const favoritesList = await getFavoritesList(user);
  const siteMetadata = await getSiteMetadata();

  return (
    <AuthGuard user={user}>
      <SiteMetadataSetter matadata={siteMetadata}>
        <NuqsAdapter>
          <LayoutTopNavbar />
          <FavoritesProductInitProvider initValue={favoritesList}>
            {children}
          </FavoritesProductInitProvider>
          <InventoryModal />
        </NuqsAdapter>
      </SiteMetadataSetter>
    </AuthGuard>
  );
}
