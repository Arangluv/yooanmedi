'use client';

import clsx from 'clsx';
import { PopupFramerCarousel } from '@/components/ui/popup-framer-carousel';
import { useEffect, useState } from 'react';

export default function Popup({ popup }: { popup: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // 로딩 상태 추가

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

  if (!isOpen || !isLoaded || !popup.popupItems.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/20">
      <div className="h-[520px] w-[400px] bg-white">
        <PopupFramerCarousel popup={popup} />
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
}
