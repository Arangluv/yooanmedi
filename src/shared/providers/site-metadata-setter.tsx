'use client';

import { useEffect } from 'react';
import { useSiteMetaStore } from './useSiteMetaStore';
import { GetSiteMetaSettingApiResponse } from '@/entities/meta-setting';
import { BaseError } from '../core';

// todo :: refactor
export const SiteMetadataSetter = ({
  mataSettingResponse,
  children,
}: {
  mataSettingResponse: GetSiteMetaSettingApiResponse;
  children: React.ReactNode;
}) => {
  const { setMinOrderPrice } = useSiteMetaStore();

  if (!mataSettingResponse.isSuccess) {
    throw new BaseError({
      clientMsg: '사이트 설정을 불러오는데 문제가 발생했습니다',
      errorName: 'SiteMetaSetterError',
    });
  }

  useEffect(() => {
    const { data } = mataSettingResponse;
    setMinOrderPrice(data.minOrderPrice);
  }, [mataSettingResponse]);

  return children;
};
