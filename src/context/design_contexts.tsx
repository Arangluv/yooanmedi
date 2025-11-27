'use client'

import { StaticImageData } from 'next/image'
import { createContext, useState } from 'react'
import V3LogoImage from '@public/v3_logo_full.png'
import Concept1 from '@/app/(frontend)/_components/Concept1'

export const LogoContext = createContext({
  logoImage: V3LogoImage,
  setLogoImage: (logoImage: StaticImageData) => {},
})

export const LogoProvider = ({ children }: { children: React.ReactNode }) => {
  const [logoImage, setLogoImage] = useState(V3LogoImage)
  return <LogoContext.Provider value={{ logoImage, setLogoImage }}>{children}</LogoContext.Provider>
}

export const DesignContext = createContext({
  design: <Concept1 />,
  setDesign: (design: React.ReactElement) => {},
})

export const DesignProvider = ({ children }: { children: React.ReactNode }) => {
  const [design, setDesign] = useState<React.ReactElement>(<Concept1 />)
  return <DesignContext.Provider value={{ design, setDesign }}>{children}</DesignContext.Provider>
}
