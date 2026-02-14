'use client';

import { create } from 'zustand';

type FavoritesValue = {
  id: number;
  userId: number;
  productId: number;
};

type FavoritesProductStore = {
  favoritesList: Map<number, FavoritesValue>;
  setFavoritesList: (favoritesList: Map<number, FavoritesValue>) => void;
  addFavoritesProduct: (favorites: FavoritesValue) => void;
  removeFavoritesProduct: (favorites: FavoritesValue) => void;
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
