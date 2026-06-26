'use client';

import { useFavoriteProducts } from '@/features/favorites';
import { EmptyProductList } from '@/entities/product';
import ProductList from '../ProductList';

export const FavoritesView = () => {
  const favoriteProducts = useFavoriteProducts();
  console.log('front에서 favoriteProducts');
  console.log(favoriteProducts);

  return (
    <section className="mt-16 flex w-5xl flex-shrink-0 flex-col gap-16">
      <div className="flex w-full flex-col gap-6">
        <h2 className="text-2xl font-bold">
          <span className="text-brand">관심상품</span>
        </h2>
        {favoriteProducts.length > 0 ? (
          <ProductList products={favoriteProducts} />
        ) : (
          <EmptyProductList
            title="등록된 관심상품이 없습니다."
            description="등록된 관심상품이 없습니다."
          />
        )}
      </div>
    </section>
  );
};
