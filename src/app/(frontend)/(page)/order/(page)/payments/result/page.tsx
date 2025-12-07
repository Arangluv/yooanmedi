'use client'

import { useEffect } from 'react'

export default function PaymentsResultPage() {
  useEffect(() => {
    window.opener.postMessage('payment-success', '*')
    window.close()
  }, [])

  return <div></div>
}
