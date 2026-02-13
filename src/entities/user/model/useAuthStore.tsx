'use client';

import { useContext } from 'react';

import type { AuthState } from './auth-store-provider';
import { AuthStoreContext } from './auth-store-provider';
import { useStore } from 'zustand';

function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }

  return useStore(store, selector);
}

export default useAuthStore;
