'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import Image from 'next/image';
import TempImage1 from '@public/banner_t1.gif';
import TempImage2 from '@public/banner_t2.jpg';
import TempImage3 from '@public/banner_t3.webp';
import TempImage from '@public/banner_t2.jpg';
import { ContentRenderer } from './content-renderer';

export const items = [
  {
    id: 1,
    url: TempImage1.src,
    title: 'Misty Mountain Majesty',
  },
  {
    id: 2,
    url: TempImage2.src,
    title: 'Winter Wonderland',
  },
  {
    id: 3,
    url: TempImage3.src,
    title: 'Autumn Mountain Retreat',
  },
];

export function PopupFramerCarousel({ popup }: { popup: any }) {
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
        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl border border-white/30 bg-white/20 p-2">
          {popupItems.map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-black' : 'w-2 bg-black/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RichTextContent({ content }: { content: any }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-12 py-8">
      <ContentRenderer content={content} />
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
