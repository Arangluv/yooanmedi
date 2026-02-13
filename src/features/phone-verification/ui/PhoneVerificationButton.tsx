'use client';

import Script from 'next/script';
import { Fragment, useEffect } from 'react';

import { Button } from '@/shared/ui/shadcn/button';

import { USAGE_CODE } from '../constants/usage-code';

declare global {
  interface Window {
    MOBILEOK: {
      process: (url: string, env: 'WB' | 'MB', callbackName: string) => void;
    };
    onMokResult: (payload: any) => void;
  }
}

const PhoneVerificationButton = ({ usageCode }: { usageCode: keyof typeof USAGE_CODE }) => {
  const handlePhoneVerification = async (params: { usageCode: keyof typeof USAGE_CODE }) => {
    if (!window.MOBILEOK) {
      alert('휴대폰 인증 모듈을 불러오는데 실패했습니다');
      return;
    }

    window.MOBILEOK.process('/api/mok/client-info?usageCode=' + usageCode, 'WB', 'onMokResult');
  };

  useEffect(() => {
    window.onMokResult = (payload: any) => {
      try {
        const res = JSON.parse(payload);
        console.log(res);
      } catch (error) {
        alert('휴대폰 인증 결과를 파싱하는데 실패했습니다');
        console.error(error);
      }
    };
  }, []);

  return (
    <Fragment>
      <Script src={process.env.NEXT_PUBLIC_MOK_URL} strategy="beforeInteractive" />
      <Button
        onClick={async (e) => {
          e.preventDefault();
          // const clientInfo = await generateClientInfo(usageCode);
          // console.log(clientInfo);
          handlePhoneVerification({ usageCode: usageCode });
        }}
      >
        휴대폰 인증
      </Button>
    </Fragment>
  );
};

export default PhoneVerificationButton;
