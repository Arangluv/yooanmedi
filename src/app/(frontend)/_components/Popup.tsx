'use client'

import clsx from 'clsx'
import { PopupFramerCarousel } from '@/components/ui/popup-framer-carousel'
import { useEffect, useState } from 'react'

export default function Popup({ popup }: { popup: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false) // 로딩 상태 추가

  useEffect(() => {
    // 오늘 날짜 확인
    const today = new Date().toDateString()
    const hideUntil = localStorage.getItem('popup-hide-until')

    // 저장된 날짜가 오늘과 다르면 팝업 표시
    if (hideUntil !== today) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }

    setIsLoaded(true) // 로딩 완료
  }, [])

  const handleHideToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem('popup-hide-until', today)
    setIsOpen(false)
  }

  if (!isOpen || !isLoaded || !popup.popupItems.length) return null

  return (
    <div className="fixed inset-0 w-full h-full bg-black/20 flex flex-col items-center justify-center z-50">
      <div className="w-[400px] h-[520px] bg-white">
        <PopupFramerCarousel popup={popup} />
      </div>
      <div className="w-[400px] flex justify-between bg-brand">
        <button
          className={clsx(
            'w-1/2 flex items-center justify-center text-white text-[14px] py-4 font-bold border-r border-white/20',
            'hover:bg-brandWeek transition-colors duration-300 cursor-pointer',
          )}
          onClick={handleHideToday}
        >
          오늘하루 보지 않기
        </button>
        <button
          className={clsx(
            'w-1/2 flex items-center justify-center text-white text-[14px] py-4 font-bold',
            'hover:bg-brandWeek transition-colors duration-300 cursor-pointer',
          )}
          onClick={() => setIsOpen(false)}
        >
          닫기
        </button>
      </div>
    </div>
  )
}
