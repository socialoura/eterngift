'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'

const MobileContext = createContext(false)

export function useIsMobile() {
  return useContext(MobileContext)
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(true)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setShouldReduceMotion(isMobileDevice || prefersReducedMotion)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <MobileContext.Provider value={isMobile}>
      <MotionConfig
        reducedMotion={shouldReduceMotion ? 'always' : 'never'}
        transition={shouldReduceMotion ? { duration: 0, delay: 0 } : undefined}
      >
        {children}
      </MotionConfig>
    </MobileContext.Provider>
  )
}
