'use client';

import Script from 'next/script';
import { Fragment, useEffect, useState } from 'react';

import { Button } from '@/shared/ui/shadcn/button';

import { USAGE_CODE } from '../constants/usage-code';
import { payloadDecode } from '../lib/payload-decode';
import { PhoneVerificationResult } from '../model/types';

declare global {
  interface Window {
    MOBILEOK: {
      process: (url: string, env: 'WB' | 'MB', callbackName: string) => void;
    };
    onMokResult: (payload: any) => void;
  }
}

interface PhoneVerificationButtonProps {
  usageCode: (typeof USAGE_CODE)[keyof typeof USAGE_CODE];
  isDisabled?: boolean;
  onResult: (result: PhoneVerificationResult) => void;
}

type PhoneVerificationApprovalPayload = {
  resultCode: string;
  resultMsg: string;
  serviceId: string;
  encryptMOKResult: string;
};

const PhoneVerificationButton = ({
  usageCode,
  onResult,
  isDisabled = false,
  ...props
}: React.ComponentProps<typeof Button> & PhoneVerificationButtonProps) => {
  const [scriptLoad, setScriptLoad] = useState(false);

  const handlePhoneVerification = async () => {
    if (!window.MOBILEOK) {
      alert('휴대폰 인증 모듈을 불러오는데 실패했습니다');
      return;
    }

    window.MOBILEOK.process('/api/mok/client-info?usageCode=' + usageCode, 'WB', 'onMokResult');
  };

  useEffect(() => {
    window.onMokResult = async (payload: string) => {
      try {
        const result: PhoneVerificationApprovalPayload = JSON.parse(payload);
        const decoded = await payloadDecode(result.encryptMOKResult);
        if (!decoded) {
          throw new Error('휴대폰 인증 결과를 불러오는데 실패했습니다');
        }

        onResult({
          success: true,
          data: decoded,
        });
      } catch (error) {
        alert('휴대폰 인증 결과를 불러오는데 실패했습니다');
        console.error(error);
      }
    };
  }, []);

  return (
    <Fragment>
      <Script src={process.env.NEXT_PUBLIC_MOK_URL} strategy="afterInteractive" />
      <Button
        disabled={scriptLoad || isDisabled}
        onClick={async (e) => {
          e.preventDefault();
          handlePhoneVerification();
        }}
        onLoad={() => setScriptLoad(true)}
        {...props}
      >
        휴대폰 인증
      </Button>
    </Fragment>
  );
};

export default PhoneVerificationButton;
