'use client';

import { useEffect } from 'react';

import { useSiteMetaStore } from './useSiteMetaStore';

type SiteMetadata = {
  minOrderPrice: number;
};

export const SiteMetadataSetter = ({
  matadata,
  children,
}: {
  matadata: SiteMetadata;
  children: React.ReactNode;
}) => {
  const { setMinOrderPrice } = useSiteMetaStore();

  useEffect(() => {
    setMinOrderPrice(matadata.minOrderPrice);
  }, [matadata]);

  return children;
};
