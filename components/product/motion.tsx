'use client'

import {
  animate,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { formatINR } from '@/lib/product'

const ease = [0.22, 1, 0.36, 1] as const
const MotionContext = createContext({ enabled: true, paused: false, toggle: () => {} })

export function ProductMotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const enabled = !reducedMotion && !paused
  const value = useMemo(() => ({ enabled, paused, toggle: () => setPaused((current) => !current) }), [enabled, paused])

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off'
    return () => { delete document.documentElement.dataset.motion }
  }, [enabled])

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ duration: enabled ? 0.7 : 0, ease }}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  )
}

export const useProductMotion = () => useContext(MotionContext)

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { enabled } = useProductMotion()
  return (
    <motion.div
      initial={enabled ? { opacity: 0, y: 28, filter: 'blur(5px)' } : false}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: enabled ? 0.8 : 0, delay: enabled ? delay : 0, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealWords({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const { enabled } = useProductMotion()
  return (
    <span className={cn('block', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {(text || '').split(' ').map((word, index, arr) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom py-1 -my-1">
            <motion.span
              className="inline-block origin-bottom"
              initial={enabled ? { y: '110%', rotate: 4, opacity: 0 } : false}
              animate={enabled ? { y: 0, rotate: 0, opacity: 1 } : false}
              transition={{ duration: enabled ? 0.95 : 0, delay: enabled ? delay + index * 0.09 : 0, ease }}
            >
              {word}{index < arr.length - 1 ? '\u00a0' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  )
}

export function AnimatedMoney({ value, className }: { value: number; className?: string }) {
  const { enabled } = useProductMotion()
  const count = useMotionValue(value)
  const display = useTransform(count, (latest) => formatINR(Math.round(latest)))

  useEffect(() => {
    if (!enabled) { count.set(value); return }
    const animation = animate(count, value, { duration: 0.55, ease })
    return () => animation.stop()
  }, [value, count, enabled])

  return (
    <span className={className}>
      <span className="sr-only">{formatINR(value)}</span>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  )
}
