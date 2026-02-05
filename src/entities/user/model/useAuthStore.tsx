'use client';

import { useContext } from 'react';

import type { AuthState } from './auth-store-provider';
import { AuthStoreContext } from './auth-store-provider';
import { useStore } from 'zustand';

function useAuthStore(): AuthState;
function useAuthStore<T>(selector: (state: AuthState) => T): T;
function useAuthStore<T>(selector?: (state: AuthState) => T) {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreProvider');
  }

  return selector ? useStore(store, selector) : useStore(store, (s) => s);
}

export default useAuthStore;
