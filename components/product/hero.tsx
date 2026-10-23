'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUpRight, BadgeCheck, Check, Infinity as InfinityIcon, Server, ShieldCheck, Users } from 'lucide-react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button, buttonVariants } from '@/components/product/ui/button'
import { cn } from '@/lib/utils'
import { useContent, useData } from '@/components/data-provider'
import { ProductPreview } from './product-preview'
import { Reveal, RevealWords, useProductMotion } from './motion'

function HeroShowcase({ id }: { id: string }) {
  const data = useData();
  const p = data.products?.[id] || {} as any;
  const stage = useRef<HTMLDivElement>(null)
  const { enabled } = useProductMotion()
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 22])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.15])
  const frameY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -25])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [9, 2, -3])
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-6, -3, 0])

  return (
    <div>
      <motion.div ref={stage} className="hero-stage" initial={enabled ? { opacity: 0, y: 45 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: enabled ? 0.3 : 0, duration: enabled ? 0.9 : 0 }}>
        <motion.div className="absolute inset-0" style={{ y: enabled ? imageY : 0, scale: enabled ? imageScale : 1.1 }}>
          {/* <Image src="/placeholder.svg?height=900&width=1600" alt="" fill priority sizes="(max-width: 767px) 100vw, 1280px" className="hero-stage-image" /> */}
        </motion.div>
        <div className="hero-stage-note">
          <p className="font-mono text-sm leading-relaxed tracking-wide">{(p.hero_eyebrow_1 || 'BIG POSSIBILITIES.')}<br /> {(p.hero_eyebrow_2 || 'YOUR LITTLE CORNER')}<br className="hidden md:block" /> {(p.hero_eyebrow_3 || 'OF THE INTERNET.')}</p>
        </div>
        <motion.div className="hero-stage-frame" style={{ y: enabled ? frameY : 0, rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0 }}>
          <Image src={p.images?.[0] || "/placeholder.jpg"} alt="Product Preview" width={1600} height={900} className="w-full h-full object-cover" />
        </motion.div>
        <motion.div className="hero-security-note p-3.5" animate={{ y: enabled ? [0, -5, 0] : 0 }} transition={{ duration: 6, repeat: enabled ? Infinity : 0, ease: 'easeInOut' }}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground"><ShieldCheck className="size-5" /></span>
            <div className="flex flex-col gap-0.5"><span className="text-sm font-semibold">{(p.hero_sec_title || 'Your data stays yours.')}</span><span className="text-sm text-muted-foreground">{(p.hero_sec_subtitle || 'On-prem. On your terms.')}</span></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function ProductHero({ id, onTour }: { id: string; onTour?: () => void }) {
  const data = useData();
  const p = data.products?.[id] || {} as any;
  return (
    <section id="overview" aria-labelledby="hero-heading" className="page-shell">
      <div className="pb-10 pt-11 md:pb-11 md:pt-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-1 flex-col gap-5">
            <Reveal><span className="section-eyebrow flex items-center gap-2.5 font-mono"><span className="size-2 rounded-full bg-primary" aria-hidden="true" />{(p.hero_eyebrow || `MEET PRODUCT ${id.toUpperCase()}`)}</span></Reveal>
            <h1 id="hero-heading" className="hero-title text-balance">
              <RevealWords text={(p.hero_title_1 || 'Your customers.')} delay={0.05} />
              <span className="block"><RevealWords text={(p.hero_title_2 || 'Your rules')} delay={0.2} className="inline-block" /><span className="text-primary">.</span></span>
            </h1>
          </div>
          <Reveal delay={0.25} className="w-full md:max-w-[460px] lg:max-w-[520px] shrink-0">
            <div className="flex flex-col gap-5">
              <p className="max-w-md text-base text-muted-foreground">{p.hero_desc || 'All your relationships. One powerful suite. A modern cloud workspace with a price that doesn’t grow with your team.'}</p>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <a
                  href="#why-product"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'default' }),
                    'h-11 px-5 rounded-full font-semibold shadow-sm transition-all hover:brightness-105 active:scale-95 shrink-0 whitespace-nowrap'
                  )}
                >
                  {(p.hero_btn_features || 'See features')} <ArrowDown className="ml-1 size-4" />
                </a>
                <a
                  href="#pricing"
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'default' }),
                    'h-11 px-5 rounded-full font-semibold border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95 shrink-0 whitespace-nowrap'
                  )}
                >
                  {(p.hero_btn_pricing || 'View pricing')} <ArrowDown className="ml-1 size-4" />
                </a>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4" aria-hidden="true" />{p.hero_pricing_note || useContent('product_hero_pricing_note', id === 'poss' ? '₹3,000 / year. Unlimited registers & cashiers.' : '₹1,000 / month (₹12,000 / year). Your whole team included.')}</p>
            </div>
          </Reveal>
        </div>
      </div>
      <HeroShowcase id={id} />
      <div className="border-b border-border py-8 md:py-9">
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {[
            { icon: Server, title: p.highlights?.[0]?.title || p.features?.[0]?.title || 'Cloud first. Fast & reliable.', detail: p.highlights?.[0]?.desc || p.features?.[0]?.desc || 'A modern workspace that is always available.' },
            { icon: Users, title: p.highlights?.[1]?.title || p.features?.[1]?.title || 'Grow your team. Not your bill.', detail: p.highlights?.[1]?.desc || p.features?.[1]?.desc || 'No per-seat pricing. No artificial caps.' },
            { icon: BadgeCheck, title: p.highlights?.[2]?.title || p.features?.[2]?.title || 'One subscription. Everything included.', detail: p.highlights?.[2]?.desc || p.features?.[2]?.desc || 'Flat yearly price. Support included. No surprises.' },
          ].map(({ icon: Icon, title, detail }, index) => (
            <Reveal key={title} delay={index * 0.1}>
              <div className="flex items-start gap-3.5">
                <Icon className="size-5 shrink-0 text-foreground" strokeWidth={1.5} />
                <div className="flex flex-col gap-1.5"><span className="text-sm font-semibold">{title}</span><span className="text-sm text-muted-foreground">{detail}</span></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
