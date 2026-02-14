'use client';

import { create } from 'zustand';
import type { FavoriteValue } from './types';

type FavoritesProductStore = {
  favoritesList: Map<number, FavoriteValue>;
  setFavoritesList: (favoritesList: Map<number, FavoriteValue>) => void;
  addFavoritesProduct: (favorites: FavoriteValue) => void;
  removeFavoritesProduct: (favorites: FavoriteValue) => void;
};

const useFavoritesProductStore = create<FavoritesProductStore>((set, get) => ({
  favoritesList: new Map(),
  setFavoritesList: (favoritesList) => set({ favoritesList }),
  addFavoritesProduct: (favorites) => {
    const newMap = new Map(get().favoritesList);
    newMap.set(favorites.id, favorites);

    return set({ favoritesList: newMap });
  },
  removeFavoritesProduct: (favorites) => {
    const newMap = new Map(get().favoritesList);
    newMap.delete(favorites.id);

    return set({ favoritesList: newMap });
  },
}));

export default useFavoritesProductStore;
