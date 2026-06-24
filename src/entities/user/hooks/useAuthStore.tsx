'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { AuthState } from '../stores';
import { AuthStoreContext } from '../providers';

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }

  return useStore(store, selector);
}
