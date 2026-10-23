'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Brand } from '@/components/landing/motion'
import { ProductsDropdown, productList } from '@/components/navigation/products-dropdown'
import { useProductMotion } from './motion'
import { cn } from '@/lib/utils'

export function ProductNavigation({ id }: { id?: string }) {
  const { enabled } = useProductMotion()
  const [open, setOpen] = useState(false)
  const productUpper = id ? id.toUpperCase() : 'PRODUCT'

  return (
    <header className="site-header sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="page-shell header-inner flex items-center justify-between">
        {/* Brand / Logo (Left) */}
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" aria-label="Svantham home" onClick={() => setOpen(false)}>
            <Brand />
          </Link>
        </div>

        {/* Navigation Links (Mathematically Centered) */}
        <nav className="hidden items-center justify-center gap-8 md:flex" aria-label="Product navigation">
          <ProductsDropdown currentSlug={id} />
          <a className="nav-link" href="#overview">Overview</a>
          <a className="nav-link" href="#why-product">Why {productUpper}</a>
          <a className="nav-link" href="#pricing">Pricing</a>
          <a className="nav-link" href="#faqs">FAQs</a>
        </nav>

        {/* Right CTA / Mobile Toggle */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <a
            href="#pricing"
            className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'header-cta hidden md:inline-flex')}
          >
            Get started<ArrowUpRight data-icon="inline-end" />
          </a>
          <Button
            className="md:hidden"
            variant="outline"
            size="icon-lg"
            aria-expanded={open}
            aria-controls="product-mobile-navigation"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="product-mobile-navigation"
            className="mobile-navigation md:hidden border-b border-border bg-background px-6 py-4"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 pb-2 border-b border-border/40">
                <span className="text-[11px] font-mono uppercase text-muted-foreground px-2">Products</span>
                {productList.map((p) => (
                  <Link
                    key={p.slug}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-2 py-1.5 text-base font-medium rounded-lg ${
                      p.slug === id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <span>{p.name} — <span className="text-muted-foreground text-sm">{p.title}</span></span>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
                <Link
                  href="/tailored"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-2 py-1.5 text-base font-medium text-primary rounded-lg hover:bg-primary/10"
                >
                  <span>Tailored (Custom Studio)</span>
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>

              <a className="px-2 py-1.5 text-base font-medium" href="#overview" onClick={() => setOpen(false)}>Overview</a>
              <a className="px-2 py-1.5 text-base font-medium" href="#why-product" onClick={() => setOpen(false)}>Why {productUpper}</a>
              <a className="px-2 py-1.5 text-base font-medium" href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
              <a className="px-2 py-1.5 text-base font-medium" href="#faqs" onClick={() => setOpen(false)}>FAQs</a>

              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'w-full justify-center mt-2')}
              >
                Get started<ArrowUpRight data-icon="inline-end" />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
