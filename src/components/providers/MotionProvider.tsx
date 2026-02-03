'use client'

import { ReactNode, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'

export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)')

    const update = () => setReduceMotion(mq.matches)
    update()

    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <MotionConfig
      reducedMotion={reduceMotion ? 'always' : 'never'}
      transition={reduceMotion ? { duration: 0 } : undefined}
    >
      {children}
    </MotionConfig>
  )
}
