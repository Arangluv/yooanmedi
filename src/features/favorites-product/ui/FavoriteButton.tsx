'use client';

import { Heart } from 'lucide-react';
import type { ProductItem } from '@/entities/product';
import CardActionButton from '@/shared/ui/CardActionButton';
import useFavoritesProductAction from '../model/useFavoritesProductAction';
import useFavoritesProductStore from '../model/useFavoritesProductStore';

const FavoriteButton = ({ product }: { product: ProductItem }) => {
  const favoritesList = useFavoritesProductStore((state) => state.favoritesList);

  const { createMutation, deleteMutation, isCreating, isDeleting } = useFavoritesProductAction({
    product,
  });

  if (favoritesList.has(product.id)) {
    return (
      <CardActionButton
        id={`favorite-button-${product.id}`}
        icon={<Heart className="h-4 w-4 text-white" strokeWidth={1.5} />}
        description="관심상품 삭제"
        onClick={deleteMutation}
        className="bg-red-400"
        isLoading={isDeleting}
      />
    );
  }

  return (
    <CardActionButton
      id={`favorite-button-${product.id}`}
      icon={<Heart className="h-4 w-4 text-white" strokeWidth={1.5} />}
      description="관심상품 추가"
      onClick={createMutation}
      isLoading={isCreating}
    />
  );
};

export default FavoriteButton;
