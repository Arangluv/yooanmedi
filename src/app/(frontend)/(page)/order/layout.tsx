import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { AuthGuard } from '@/entities/user';
import { getSiteMetadata, SiteMetadataSetter } from '@/shared';
import LayoutTopNavbar from '@/entities/order/ui/LayoutTopNavbar';
import { getFavoritesList } from '@/features/favorites-product/api/favorites-list';
import FavoritesProductInitProvider from '@/features/favorites-product/model/favorites-Init-provider';
import { UserRepository } from '@/entities/user/infrastructure'; // todo refactor
import { getCart, CartModal } from '@/entities/cart';
import { CartHydrationProvider } from '@/entities/cart';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  const user = await UserRepository.findByHeader();
  const favoritesList = await getFavoritesList(user);
  const siteMetadata = await getSiteMetadata();
  const cart = await getCart();

  return (
    <AuthGuard user={user}>
      {/* TODO :: Refactor -> Provider의 Depth가 깊어지는 문제 (전역상태관리 모범사례 참고) */}
      <SiteMetadataSetter matadata={siteMetadata}>
        <NuqsAdapter>
          <LayoutTopNavbar />
          <FavoritesProductInitProvider initValue={favoritesList}>
            <CartHydrationProvider initialData={cart}>{children}</CartHydrationProvider>
          </FavoritesProductInitProvider>
        </NuqsAdapter>
      </SiteMetadataSetter>
    </AuthGuard>
  );
}
