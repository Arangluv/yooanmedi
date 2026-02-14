
export type BeforeNormalizeFavoritesProduct = {
  id: number;
  user: {
    id: number;
  };
  product: {
    id: number;
  };
};

export type NormalizedFavoritesItem = [number, { id: number; userId: number; productId: number }];

export const normalizeFavoritesProduct = (
  favorites: BeforeNormalizeFavoritesProduct[],
): NormalizedFavoritesItem[] => {
  return favorites.map((favorite): NormalizedFavoritesItem => {
    return [
      favorite.product.id,
      {
        id: favorite.id,
        userId: favorite.user.id,
        productId: favorite.product.id,
      },
    ];
  });
};
