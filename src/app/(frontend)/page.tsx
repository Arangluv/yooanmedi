'use client'

import { DesignContext } from '@/context/design_contexts'
import { useContext } from 'react'

export default function HomePage() {
  const { design } = useContext(DesignContext)

  return <div className="w-full h-full">{design}</div>
}
