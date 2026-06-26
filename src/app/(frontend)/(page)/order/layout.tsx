import { AuthGuard } from '@/entities/user';
import { NuqsProvider, SiteMetadataSetter } from '@/shared';
import { getSiteMetadata } from '@/shared/infrastructure';
import LayoutTopNavbar from '@/entities/order/ui/LayoutTopNavbar';
import { CartDetailHydrator, getCartApi } from '@/features/cart-detail';
import { getFavoriteProductsApi, getFavoritesApi } from '@/features/favorites';
import { UserApiRepository, UserAdapter } from '@/entities/user/infrastructure';
import { FavoritesHydrator, FavoriteProductsHydrator } from '@/features/favorites';
export const dynamic = 'force-dynamic';

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  // todo :: error handling
  const userApiRepository = new UserApiRepository(UserAdapter());
  const user = await userApiRepository.findByHeader();

  const [favoritesResponse, favoriteProductsResponse, siteMetadata, cart] = await Promise.all([
    getFavoritesApi({ user: user.id }),
    getFavoriteProductsApi({ user: user.id }),
    getSiteMetadata(),
    getCartApi(),
  ]);

  return (
    <AuthGuard user={user}>
      {/* TODO :: Refactor -> Provider의 Depth가 깊어지는 문제 (전역상태관리 모범사례 참고) */}
      <SiteMetadataSetter matadata={siteMetadata}>
        <NuqsProvider>
          <LayoutTopNavbar />
          <CartDetailHydrator initialData={cart}>
            <FavoritesHydrator initialData={favoritesResponse}>
              <FavoriteProductsHydrator initialData={favoriteProductsResponse}>
                {children}
              </FavoriteProductsHydrator>
            </FavoritesHydrator>
          </CartDetailHydrator>
        </NuqsProvider>
      </SiteMetadataSetter>
    </AuthGuard>
  );
}
