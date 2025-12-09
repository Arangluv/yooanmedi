import { LoaderCircle } from 'lucide-react'

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white/20 z-999">
      <span style={{ animation: 'spin 1s linear infinite', transformOrigin: 'center center' }}>
        <LoaderCircle className="w-4 h-4 text-black/60 animate-spin" />
      </span>
    </div>
  )
}
