'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { PayloadRichTextRenderer } from './payload';
import { motion, useMotionValue, animate } from 'motion/react';
import { PayloadRichTextContent } from '../types';

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
