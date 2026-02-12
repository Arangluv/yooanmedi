'use client';

import { useEffect } from 'react';

import useSiteMetaStore from './useSiteMetaStore';
import type { SiteMetadata } from '../api/get-site-metadata';

const SiteMetadataSetter = ({
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

export default SiteMetadataSetter;
