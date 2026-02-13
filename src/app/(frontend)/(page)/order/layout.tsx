import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { getUserByHeader, AuthGuard } from '@/entities/user';
import { getSiteMetadata, SiteMetadataSetter } from '@/shared';
import LayoutTopNavbar from '@/entities/order/ui/LayoutTopNavbar';
import InventoryModal from '@/features/inventory/ui/InventoryModal';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserByHeader();
  const siteMetadata = await getSiteMetadata();

  return (
    <AuthGuard user={user}>
      <SiteMetadataSetter matadata={siteMetadata}>
        <NuqsAdapter>
          <LayoutTopNavbar />
          {children}
          <InventoryModal />
        </NuqsAdapter>
      </SiteMetadataSetter>
    </AuthGuard>
  );
}
