import React, { FC } from 'react';
import { AuthGuard } from '@/entities/user';
import { NuqsProvider, SiteMetadataSetter } from '@/shared';
import { AccountUtilityBar } from '@/widget/AccountUtilityBar';
import { CartDetailHydrator, getCartApi } from '@/features/cart-detail';
import { getFavoriteProductsApi, getFavoritesApi } from '@/features/favorites';
import { UserApiRepository, UserAdapter } from '@/entities/user/infrastructure';
import { FavoritesHydrator, FavoriteProductsHydrator } from '@/features/favorites';
import { getSiteMetaSettingApi } from '@/entities/meta-setting';

interface Props {
  children: React.ReactNode;
}

export const LoginLayout: FC<Props> = async ({ children }: Props) => {
  // todo :: error handling
  const userApiRepository = new UserApiRepository(UserAdapter());
  const user = await userApiRepository.findByHeader();

  const [favoritesResponse, favoriteProductsResponse, siteMetaSettingResponse, cart] =
    await Promise.all([
      getFavoritesApi({ user: user.id }),
      getFavoriteProductsApi({ user: user.id }),
      getSiteMetaSettingApi(),
      getCartApi(),
    ]);

  return (
    <AuthGuard user={user}>
      {/* TODO :: Refactor -> Provider의 Depth가 깊어지는 문제 (전역상태관리 모범사례 참고) */}
      <SiteMetadataSetter mataSettingResponse={siteMetaSettingResponse}>
        <NuqsProvider>
          <AccountUtilityBar />
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
};
