'use client';

import { useLayoutEffect } from 'react';
import { User } from './type';
import useAuthStore from './useAuthStore';

type AuthHydratorProps = {
  user: User;
  children: React.ReactNode;
};

const AuthHydrator = ({ user, children }: AuthHydratorProps) => {
  const setUser = useAuthStore((state) => state.setUser);

  useLayoutEffect(() => {
    setUser(user);
  }, []);

  return children;
};

export default AuthHydrator;