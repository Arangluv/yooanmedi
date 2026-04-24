'use client';

import { useQuery } from '@tanstack/react-query';

import { EmptyProductList, Product } from '@/entities/product';

import ProductList from '../ProductList';

// TODO :: 잘못된 참조방식 -> 개선필요
import useFavoritesProductStore from '@/features/favorites-product/model/useFavoritesProductStore';
import { getFavoritesProductList } from '@/features/favorites-product/api/product-list';

const FavoritesView = () => {
  const favoritesList = useFavoritesProductStore((state) => state.favoritesList);

  const { data } = useQuery({
    queryKey: ['favorites-products', favoritesList.size],
    queryFn: () => getFavoritesProductList(Array.from(favoritesList.values())),
  });

  if (!data) return null;

  return (
    <section className="mt-16 flex w-5xl flex-shrink-0 flex-col gap-16">
      <ListSection products={data as Product[]} />
    </section>
  );
};

const ListSection = ({ products }: { products: Product[] }) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <span className="text-brand">관심상품</span>
      </h2>
      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <EmptyProductList
          title="등록된 관심상품이 없습니다."
          description="등록된 관심상품이 없습니다."
        />
      )}
    </div>
  );
};

export default FavoritesView;
