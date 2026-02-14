'use client';

import { useEffect } from 'react';

import { BeforeNormalizeFavoritesProduct, normalizeFavoritesProduct } from '../lib/normalize';
import useFavoritesProductStore from './useFavoritesProductStore';

const FavoritesProductInitProvider = ({
  children,
  initValue,
}: {
  children: React.ReactNode;
  initValue: BeforeNormalizeFavoritesProduct[];
}) => {
  const { setFavoritesList } = useFavoritesProductStore();

  useEffect(() => {
    const normalizedFavorites = normalizeFavoritesProduct(initValue);
    setFavoritesList(new Map(normalizedFavorites));
  }, [initValue]);

  return <>{children}</>;
};

export default FavoritesProductInitProvider;
