'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export const productList = [
  {
    name: 'CRM',
    slug: 'crm',
    title: 'Customer relationships',
    href: '/product/crm',
  },
  {
    name: 'POSS',
    slug: 'poss',
    title: 'Point of sale',
    href: '/product/poss',
  },
  {
    name: 'HRMS',
    slug: 'hrms',
    title: 'Human resources',
    href: '/product/hrms',
  },
  {
    name: 'FSM',
    slug: 'fsm',
    title: 'Field service',
    href: '/product/fsm',
  },
  {
    name: 'OMS',
    slug: 'oms',
    title: 'Order management',
    href: '/product/oms',
  },
]

export function ProductsDropdown({
  currentSlug,
  align = 'center',
}: {
  currentSlug?: string
  align?: 'center' | 'left'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="nav-link inline-flex items-center gap-1.5 transition-colors focus:outline-none"
      >
        <span>Products</span>
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute top-full z-50 mt-2 w-48 rounded-xl border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-md ${
              align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'
            }`}
          >
            <div className="flex flex-col gap-0.5">
              {productList.map((item) => {
                const isActive = item.slug === currentSlug
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </Link>
                )
              })}
              <div className="my-1 border-t border-border/60" />
              <Link
                href="/tailored"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                <span>Tailored</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Custom</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
