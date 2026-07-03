import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, FieldGroupWrapper } from '@/shared/ui/inputs';
import type { InputProps } from '@/shared/ui/inputs';
import { InputGroupButton } from '@/shared/ui/shadcn';
import Image from 'next/image';
export type AddressInputProps = Omit<InputProps, 'onChange'> & {
  onChange?: (value: string) => void;
};

export const AddressInput = (props: AddressInputProps) => {
  const { ref, onChange, ...restProps } = props;
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 다음 우편번호 API 스크립트가 로드된 후 실행
    if (typeof window !== 'undefined' && (window as any).daum) {
      initLayerPosition();
    }
  }, [isLayerVisible]);

  const closeDaumPostcode = () => {
    setIsLayerVisible(false);
  };

  const execDaumPostcode = () => {
    if (typeof window === 'undefined' || !(window as any).daum) {
      return;
    }

    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        let addr = '';
        let extraAddr = '';

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        const fullAddress = `${addr} ${extraAddr}, ${data.zonecode}`;
        onChange?.(fullAddress);
        setIsLayerVisible(false);

        // 상세주소 입력 필드로 포커스 이동
        const detailInput = document.querySelector(
          'input[name="address-detail"]',
        ) as HTMLInputElement;
        if (detailInput) {
          detailInput.focus();
        }
      },
      width: '100%',
      height: '100%',
      maxSuggestItems: 5,
    }).embed(layerRef.current);

    setIsLayerVisible(true);
    setTimeout(() => {
      initLayerPosition();
    }, 100);
  };

  const initLayerPosition = () => {
    if (!layerRef.current) return;

    const width = 608;
    const height = 400;
    const borderWidth = 5;

    layerRef.current.style.width = width + 'px';
    layerRef.current.style.height = height + 'px';
    layerRef.current.style.border = borderWidth + 'px solid';
  };

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <FieldGroupWrapper className="relative flex-row">
        <Input
          ref={ref}
          readOnly
          disabled
          placeholder="주소찾기를 통해 주소를 입력해주세요"
          groupContents={{
            inlineEnd: (
              <InputGroupButton
                variant={'default'}
                className="rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  execDaumPostcode();
                }}
              >
                주소찾기
              </InputGroupButton>
            ),
          }}
          {...restProps}
        />
        <div
          id="layer"
          ref={layerRef}
          style={{
            display: isLayerVisible ? 'block' : 'none',
            position: 'absolute',
            overflow: 'hidden',
            top: '100%',
            left: 0,
            zIndex: 999,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Image
            src="https://t1.daumcdn.net/postcode/resource/images/close.png"
            id="btnCloseLayer"
            width={16}
            height={16}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '-3px',
              top: '-3px',
              zIndex: 1,
            }}
            onClick={closeDaumPostcode}
            alt="닫기 버튼"
          />
        </div>
      </FieldGroupWrapper>
    </>
  );
};
