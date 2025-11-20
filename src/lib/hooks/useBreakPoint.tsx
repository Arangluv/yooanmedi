import { useMediaQuery } from 'react-responsive'

const useBreakPoint = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' })

  return { isMobile, isDesktop }
}

export default useBreakPoint
