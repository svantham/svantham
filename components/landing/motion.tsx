"use client"

import { motion, MotionConfig, useReducedMotion, type Variants } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedHeading({ lines, className }: { lines: { text: string; accent?: boolean }[]; className?: string }) {
  const reduced = useReducedMotion()
  const words: Variants = {
    hidden: { y: reduced ? 0 : "112%", rotate: reduced ? 0 : 3, opacity: 0 },
    visible: { y: 0, rotate: 0, opacity: 1, transition: { duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] } },
  }
  return (
    <motion.h1 className={cn("hero-heading font-sans", className)} initial="hidden" animate="visible" transition={{ staggerChildren: 0.13, delayChildren: 0.1 }} aria-label={lines.map((line) => line.text).join(" ")}>
      {lines.map((line) => (
        <span key={line.text} className={cn("block overflow-hidden py-1.5 -my-1.5", line.accent && "text-primary")} aria-hidden="true">
          <motion.span className="block origin-bottom-left" variants={words}>{line.text}</motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label font-mono"><span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />{children}</p>
}

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("brand font-sans flex items-center gap-3", className)}>
      <img src="/icon.svg" className="h-[1em] w-auto" alt="" aria-hidden="true" />
<span>Svantham</span>
    </span>
  )
}
