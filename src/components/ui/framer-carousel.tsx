'use client';

import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import Image from 'next/image';
import MainBannerImage from '@public/main_banner.png';
import TempImage2 from '@public/banner_t2.jpg';
import TempImage3 from '@public/banner_t3.webp';

export const items = [
  {
    id: 1,
    url: MainBannerImage.src,
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

export function FramerCarousel() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeThreshold = 50;
  const velocityThreshold = 500;

  const x = useMotionValue(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => {
        const isLastIndex = i === items.length - 1;
        return isLastIndex ? 0 : i + 1;
      });

      if (containerRef.current) {
        animate(x, -index * containerRef.current.offsetWidth, {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-lg" ref={containerRef}>
        <motion.div
          className="flex touch-pan-y"
          style={{ x }}
          drag="x"
          dragConstraints={{
            left: containerRef.current
              ? -((items.length - 1) * containerRef.current.offsetWidth)
              : 0,
            right: 0,
          }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            const offsetX = info.offset.x;
            const velocityX = info.velocity.x;

            if (offsetX > swipeThreshold || velocityX > velocityThreshold) {
              setIndex((i) => Math.max(0, i - 1));
              return;
            }

            if (offsetX < -swipeThreshold || velocityX < -velocityThreshold) {
              setIndex((i) => Math.min(items.length - 1, i + 1));
              return;
            }

            if (containerRef.current) {
              const containerWidth = containerRef.current.offsetWidth || 1;
              const draggedIndex = Math.round(Math.abs(x.get()) / containerWidth);
              const targetIndex = Math.min(items.length - 1, Math.max(0, draggedIndex));
              const targetX = -targetIndex * containerWidth;

              setIndex(targetIndex);
              animate(x, targetX, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
              });
            }
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="h-[360px] w-full shrink-0">
              <Image
                src={item.url}
                alt={item.title}
                className="pointer-events-none h-full w-full rounded-lg object-cover select-none"
                draggable={false}
                width={1000}
                height={360}
              />
            </div>
          ))}
        </motion.div>

        {/* 버튼 사용을 원한다면 주석 해제 */}
        {/* <PrevButton index={index} setIndex={setIndex} />
        <NextButton index={index} setIndex={setIndex} /> */}

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl border border-white/30 bg-white/20 p-2">
          {items.map((_, i) => (
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

function PrevButton({ index, setIndex }: { index: number; setIndex: (index: number) => void }) {
  return (
    <motion.button
      disabled={index === 0}
      onClick={() => setIndex(Math.max(0, index - 1))}
      className={`absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform ${
        index === 0
          ? 'cursor-not-allowed opacity-40'
          : 'bg-white opacity-70 hover:scale-110 hover:opacity-100'
      }`}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </motion.button>
  );
}

function NextButton({ index, setIndex }: { index: number; setIndex: (index: number) => void }) {
  return (
    <motion.button
      disabled={index === items.length - 1}
      onClick={() => setIndex(Math.min(items.length - 1, index + 1))}
      className={`absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform ${
        index === items.length - 1
          ? 'cursor-not-allowed opacity-40'
          : 'bg-white opacity-70 hover:scale-110 hover:opacity-100'
      }`}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}
