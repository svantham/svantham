'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useContent } from '@/components/data-provider'
import { ArrowUpRight, Asterisk, Menu, X } from 'lucide-react'
import { Button } from '@/components/tailored/ui/button'

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <div className="flex w-fit items-center gap-3">
      <a href="#home" aria-label="Tailored home" className="flex items-start text-[35px] leading-none font-semibold tracking-[-0.075em] transition-opacity hover:opacity-85">
        {useContent('tailored_header_title', 'tailored')}<Asterisk className="mt-0.5 size-6 text-clay" strokeWidth={1.8} aria-hidden="true" />
      </a>
      {!footer && (
        <Link
          href="/"
          aria-label="Back to Svantham home"
          className="group border-l border-primary/25 pl-3 text-sm leading-tight text-muted-foreground transition-colors hover:text-primary"
        >
          {useContent('tailored_header_by', 'by')}<br />
          <span className="font-medium text-primary group-hover:underline">{useContent('tailored_header_company', 'svantham')}</span>
        </Link>
      )}
    </div>
  )
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    { label: useContent('tailored_nav_work', 'Our work'), href: '#work' },
    { label: useContent('tailored_nav_what', 'What we do'), href: '#services' },
    { label: useContent('tailored_nav_studio', 'The studio'), href: '#studio' },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="page-shell flex h-20 items-center justify-between">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {useContent('tailored_nav_home', 'Svantham Suite')}
          </Link>
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium transition-colors hover:text-primary/70">
              {link.label}
            </a>
          ))}
          <Button variant="default" size="sm" className="ml-4 rounded-full font-medium tracking-wide" render={<a href="#footer" />} nativeButton={false}>
            Start a project <ArrowUpRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </nav>
        <button type="button" className="p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen}>
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              className="flex items-center justify-between border-b border-border/40 pb-4 text-xl font-medium tracking-[-0.03em] text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{useContent('tailored_nav_home', '← Svantham Suite')}</span>
              <ArrowUpRight className="size-5" />
            </Link>
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-xl font-medium tracking-[-0.03em]" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <Button variant="default" className="mt-4 w-full justify-between rounded-full py-6 text-base font-medium" render={<a href="#footer" onClick={() => setMobileMenuOpen(false)} />} nativeButton={false}>
              Start a project <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
