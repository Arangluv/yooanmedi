import { AuthGuard } from '@/entities/user';
import { NuqsProvider, SiteMetadataSetter } from '@/shared';
import { getSiteMetadata } from '@/shared/infrastructure';
import LayoutTopNavbar from '@/entities/order/ui/LayoutTopNavbar';
import { CartDetailHydrator, getCartApi } from '@/features/cart-detail';
import { getFavoritesList } from '@/features/favorites-product/api/favorites-list';
import FavoritesProductInitProvider from '@/features/favorites-product/model/favorites-Init-provider';
import { UserApiRepository, UserAdapter } from '@/entities/user/infrastructure';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  // todo :: error handling
  const userApiRepository = new UserApiRepository(UserAdapter());
  const user = await userApiRepository.findByHeader();

  const [favoritesList, siteMetadata, cart] = await Promise.all([
    getFavoritesList(user),
    getSiteMetadata(),
    getCartApi(),
  ]);

  return (
    <AuthGuard user={user}>
      {/* TODO :: Refactor -> Provider의 Depth가 깊어지는 문제 (전역상태관리 모범사례 참고) */}
      <SiteMetadataSetter matadata={siteMetadata}>
        <NuqsProvider>
          <LayoutTopNavbar />
          <FavoritesProductInitProvider initValue={favoritesList}>
            <CartDetailHydrator initialData={cart}>{children}</CartDetailHydrator>
          </FavoritesProductInitProvider>
        </NuqsProvider>
      </SiteMetadataSetter>
    </AuthGuard>
  );
}
