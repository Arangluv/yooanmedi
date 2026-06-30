'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import clsx from 'clsx';
import { PayloadRichTextContent, PayloadRichTextRenderer } from '@/shared';
import { GetPopupApiResponse } from '../api';

export const PopupModal = (popupResponse: GetPopupApiResponse) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 오늘 날짜 확인
    const today = new Date().toDateString();
    const hideUntil = localStorage.getItem('popup-hide-until');

    // 저장된 날짜가 오늘과 다르면 팝업 표시
    if (hideUntil !== today) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    setIsLoaded(true); // 로딩 완료
  }, []);

  const handleHideToday = () => {
    const today = new Date().toDateString();
    localStorage.setItem('popup-hide-until', today);
    setIsOpen(false);
  };

  if (!popupResponse.isSuccess) {
    return <span>{popupResponse.message}</span>;
  }

  if (!isOpen || !isLoaded || !popupResponse.data.popupItems.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/20">
      <div className="h-[520px] w-[400px] bg-white">
        <ContentCarousel popup={popupResponse.data} />
      </div>
      <div className="bg-brand flex w-[400px] justify-between">
        <button
          className={clsx(
            'flex w-1/2 items-center justify-center border-r border-white/20 py-4 text-[14px] font-bold text-white',
            'hover:bg-brandWeek cursor-pointer transition-colors duration-300',
          )}
          onClick={handleHideToday}
        >
          오늘하루 보지 않기
        </button>
        <button
          className={clsx(
            'flex w-1/2 items-center justify-center py-4 text-[14px] font-bold text-white',
            'hover:bg-brandWeek cursor-pointer transition-colors duration-300',
          )}
          onClick={() => setIsOpen(false)}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

function ContentCarousel({ popup }: { popup: any }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  const { popupItems } = popup;

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x]);

  if (!popupItems || popupItems.length === 0) return null;

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="relative h-full w-full overflow-hidden" ref={containerRef}>
        <motion.div className="flex h-full w-full" style={{ x }}>
          {popupItems.map((item: any, i: number) => (
            <div className="h-full w-full shrink-0" key={i}>
              {item.isOnlyImage ? (
                <ImageContent src={item.image?.url} />
              ) : (
                <RichTextContent content={item.content} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Prev Buttons */}
        <motion.button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className={`absolute top-1/2 left-4 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform ${
            index === 0
              ? 'cursor-not-allowed opacity-40'
              : 'bg-white opacity-70 hover:scale-110 hover:opacity-100'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        {/* Next Button */}
        <motion.button
          disabled={index === popupItems.length - 1}
          onClick={() => setIndex((i) => Math.min(popupItems.length - 1, i + 1))}
          className={`absolute top-1/2 right-4 z-10 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform ${
            index === popupItems.length - 1
              ? 'cursor-not-allowed opacity-40'
              : 'bg-white opacity-70 hover:scale-110 hover:opacity-100'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

function RichTextContent({ content }: { content: PayloadRichTextContent }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-12 py-8">
      <PayloadRichTextRenderer content={content} />
    </div>
  );
}

function ImageContent({ src }: { src: string }) {
  return (
    <div className="h-full w-full">
      <Image
        src={src}
        alt="팝업 이미지"
        width={400}
        height={520}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
