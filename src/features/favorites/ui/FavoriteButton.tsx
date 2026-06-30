'use client';

import { Heart } from 'lucide-react';
import type { Product } from '@/entities/product';
import CardActionButton from '@/shared/ui/CardActionButton';
import { useFavorites, useFavoritesMutation } from '../hooks';

export const FavoriteButton = ({ product }: { product: Product }) => {
  const favoriteMap = useFavorites();
  const favorite = favoriteMap.get(product.id);

  const { addFavorite, isAddFavoritePending, removeFavorite, isRemoveFavoritePending } =
    useFavoritesMutation(product);

  if (favorite && favoriteMap.has(product.id)) {
    const { id } = favorite;
    return (
      <CardActionButton
        id={`favorite-button-${product.id}`}
        icon={<Heart className="h-4 w-4 text-white" strokeWidth={1.5} />}
        description="관심상품 삭제"
        onClick={() => removeFavorite(id)}
        className="bg-red-400"
        isLoading={isRemoveFavoritePending}
      />
    );
  }

  return (
    <CardActionButton
      id={`favorite-button-${product.id}`}
      icon={<Heart className="h-4 w-4 text-white" strokeWidth={1.5} />}
      description="관심상품 추가"
      onClick={addFavorite}
      isLoading={isAddFavoritePending}
    />
  );
};
