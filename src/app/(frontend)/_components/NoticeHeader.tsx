'use client'

import { InfoIcon, XIcon } from 'lucide-react'
import { DesignContext, LogoContext } from '@/context/design_contexts'
import { useContext, useState } from 'react'
import V1LogoImage from '@public/v1_logo_full.png'
import V2LogoImage from '@public/v2_logo_full.png'
import V3LogoImage from '@public/v3_logo_full.png'
import Concept2 from './Concept2'
import Concept1 from './Concept1'
import { toast } from 'sonner'

export default function NoticeHeader() {
  const [isOpen, setIsOpen] = useState(true)
  const { design } = useContext(DesignContext)

  if (!isOpen) {
    return null
  }

  return (
    <div className="w-full h-[72px] shadow-md bg-white flex justify-center mb-8 relative">
      <div className="w-full max-w-7xl h-full flex items-center justify-between">
        {/* notice */}
        <div className="flex items-center gap-1">
          <InfoIcon className="w-4 h-4 text-brandWeek" />
          <span className="text-[14px] text-brandWeek font-bold">개발 모드 화면입니다</span>
        </div>
        {/* 버튼 */}
        <div className="flex items-center gap-2">
          <ChangeLogoButton />
          <ChangeDesignButton />
        </div>
        <CloseButton setIsOpen={setIsOpen} />
      </div>
    </div>
  )
}

function ChangeLogoButton() {
  const imageMapper = {
    0: V1LogoImage,
    1: V2LogoImage,
    2: V3LogoImage,
  }
  const { setLogoImage } = useContext(LogoContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const handleChangeLogo = () => {
    const newIndex = (currentIndex + 1) % Object.keys(imageMapper).length
    setCurrentIndex(newIndex)
    setLogoImage(imageMapper[newIndex as keyof typeof imageMapper])
    toast.info('알림', {
      description: '로고가 교체되었습니다',
    })
  }

  return (
    <button
      className="bg-brand text-white px-4 py-2 rounded-md text-[14px] cursor-pointer hover:bg-brandWeek transition-colors duration-300"
      onClick={handleChangeLogo}
    >
      로고 교체하기
    </button>
  )
}

function ChangeDesignButton() {
  const designMapper = {
    0: <Concept1 />,
    1: <Concept2 />,
  }
  const [currentIndex, setCurrentIndex] = useState(0)
  const { setDesign } = useContext(DesignContext)

  const handleChangeDesign = () => {
    const newIndex = (currentIndex + 1) % Object.keys(designMapper).length
    setCurrentIndex(newIndex)
    setDesign(designMapper[newIndex as keyof typeof designMapper])
    toast.info('알림', {
      description: '디자인이 교체되었습니다',
    })
  }

  return (
    <button
      className="bg-brand text-white px-4 py-2 rounded-md text-[14px] cursor-pointer hover:bg-brandWeek transition-colors duration-300"
      onClick={handleChangeDesign}
    >
      디자인 교체하기
    </button>
  )
}

function CloseButton({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  return (
    <div className="w-8 h-8 flex items-center justify-center absolute right-18 top-1/2 -translate-y-1/2 cursor-pointer hover:text-danger-600 transition-colors duration-300">
      <XIcon className="w-4 h-4 text-danger-500" onClick={() => setIsOpen(false)} />
    </div>
  )
}
