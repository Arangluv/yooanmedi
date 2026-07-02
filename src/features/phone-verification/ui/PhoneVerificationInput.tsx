'use client';

import Script from 'next/script';
import { Fragment, useEffect, useState } from 'react';
import { Button, FieldGroupWrapper, Input } from '@/shared/ui/inputs';
import { USAGE_CODE } from '../constants/usage-code';
import { payloadDecode } from '../lib/payload-decode';
import { BaseError } from '@/shared';
import { InputProps } from '@/shared/ui/inputs/Input';

declare global {
  interface Window {
    MOBILEOK: {
      process: (url: string, env: 'WB' | 'MB', callbackName: string) => void;
    };
    onMokResult: (payload: any) => void;
  }
}

export type PhoneVerificationInputProps = Omit<InputProps, 'onChange'> & {
  usageCode: (typeof USAGE_CODE)[keyof typeof USAGE_CODE];
};

type PhoneVerificationApprovalPayload = {
  resultCode: string;
  resultMsg: string;
  serviceId: string;
  encryptMOKResult: string;
};

export const PhoneNumberVerificationInput = (props: PhoneVerificationInputProps) => {
  const { usageCode, ref, ...restProps } = props;
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
          throw new BaseError({
            clientMsg: '휴대폰 인증 결과를 불러오는데 실패했습니다',
            errorName: 'PhoneVerificationError',
          });
        }
      } catch (error) {
        alert('휴대폰 인증 결과를 불러오는데 실패했습니다');
        console.error(error);
      }
    };
  }, []);

  return (
    <Fragment>
      <Script src={process.env.NEXT_PUBLIC_MOK_URL} strategy="afterInteractive" />
      <FieldGroupWrapper className="flex-row">
        <Input ref={ref} placeholder="전화번호 인증을 진행해주세요" readOnly {...restProps} />
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
      </FieldGroupWrapper>
    </Fragment>
  );
};
