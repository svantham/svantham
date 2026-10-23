"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Brand } from "@/components/landing/motion"
import { ProductsDropdown, productList } from "@/components/navigation/products-dropdown"
import { cn } from "@/lib/utils"

export function Header() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <>
      <div className="announcement">
        <a href="#products" className="announcement-link">
          Big ambitions. Not big software bills.<span className="hidden sm:inline"> Meet your unfair advantage.</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      </div>
      <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape") setOpen(false) }}>
        <div className="page-container header-inner flex items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <Link href="/" aria-label="Svantham home" onClick={() => setOpen(false)}>
              <Brand />
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-8 md:flex" aria-label="Main navigation">
            <ProductsDropdown />
            <a className="nav-link" href="#difference">Why Svantham</a>
            <a className="nav-link" href="#faq">FAQs</a>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-3">
            <a href="#products" className={cn(buttonVariants({ variant: "default", size: "lg" }), "header-cta hidden md:inline-flex")}>
              Find your software<ArrowUpRight data-icon="inline-end" />
            </a>
            <Button
              className="md:hidden"
              variant="outline"
              size="icon-lg"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-navigation"
              className="mobile-navigation md:hidden"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
            >
              <div className="mobile-navigation-inner flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1 pb-2 border-b border-border/40">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground px-2">Products</span>
                  {productList.map((p) => (
                    <Link
                      key={p.slug}
                      href={p.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2 py-1.5 text-base font-medium rounded-lg hover:bg-muted"
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
                    <span>Tailored (Custom Software)</span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
                <a className="px-2 py-1.5 text-base font-medium" href="#difference" onClick={() => setOpen(false)}>Why Svantham</a>
                <a className="px-2 py-1.5 text-base font-medium" href="#faq" onClick={() => setOpen(false)}>FAQs</a>
                <a href="#products" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full justify-center mt-2")}>
                  Find your software<ArrowUpRight data-icon="inline-end" />
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
