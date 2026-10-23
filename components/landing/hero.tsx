"use client"

import { useRef, useState, type PointerEvent } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { ArrowDown, ArrowUpRight, Check, Cloud, Infinity as InfinityIcon, LayoutGrid, LockKeyhole, MonitorPlay, Server, ShieldCheck, UsersIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { AnimatedHeading, Reveal, SectionLabel } from "@/components/landing/motion"
import { useContent } from "@/components/data-provider"
import { cn } from "@/lib/utils"

const previews = [
  { name: "CRM", title: "Every relationship. One workspace.", subtitle: "A clearer view of your customers." },
  { name: "POSS", title: "Your next sale. Made simple.", subtitle: "A workspace for your point of sale." },
  { name: "HRMS", title: "Your people. Your possibilities.", subtitle: "Bring your people operations together." },
  { name: "FSM", title: "From your office. To the field.", subtitle: "Keep field service in view." },
  { name: "OMS", title: "Every order. Under control.", subtitle: "Make room for smoother operations." },
]

function WorkspacePreview() {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const rotateX = useSpring(0, { stiffness: 160, damping: 24 })
  const rotateY = useSpring(0, { stiffness: 160, damping: 24 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -38])

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 5)
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 5)
  }

  return (
    <div ref={ref} className="workspace-scene">
      <motion.div className="workspace-assembly" style={{ y: reduced ? 0 : y, rotateX, rotateY }} onPointerMove={tilt} onPointerLeave={() => { rotateX.set(0); rotateY.set(0) }}>
        <div className="workspace-backing" aria-hidden="true" />
        <motion.div className="workspace-window" initial={{ clipPath: reduced ? "inset(0% 0% 0% 0% round 12px)" : "inset(0% 0% 100% 0% round 12px)" }} animate={{ clipPath: "inset(0% 0% 0% 0% round 12px)" }} transition={{ delay: reduced ? 0 : 0.2, duration: reduced ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}>
          <div className="workspace-chrome">
            <div className="flex items-center gap-1.5" aria-hidden="true"><span /><span /><span /></div>
            <p><LockKeyhole className="size-3" aria-hidden="true" />Dedicated instance. Your workspace.</p>
            <LayoutGrid className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="workspace-tabs" role="tablist" aria-label="Product preview">
            {previews.map((preview, index) => <button key={preview.name} id={`preview-tab-${preview.name}`} role="tab" type="button" aria-selected={active === index} aria-controls="workspace-preview" tabIndex={active === index ? 0 : -1} className={cn("workspace-tab", active === index && "is-active")} onClick={() => setActive(index)} onKeyDown={(event) => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % previews.length; else if (event.key === "ArrowLeft") next = (index - 1 + previews.length) % previews.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = previews.length - 1; else return; event.preventDefault(); setActive(next); document.getElementById(`preview-tab-${previews[next].name}`)?.focus() }}>{preview.name}</button>)}
          </div>
          <div className="workspace-media" id="workspace-preview" role="tabpanel" aria-labelledby={`preview-tab-${previews[active].name}`}>
            <motion.img className="media-placeholder" src="/placeholder.svg?height=520&width=700" width={700} height={520} alt="" initial={{ scale: reduced ? 1 : 1.18 }} animate={{ scale: 1 }} transition={{ duration: reduced ? 0 : 1.8, ease: [0.22, 1, 0.36, 1] }} />
            <AnimatePresence mode="wait">
              <motion.div key={active} className="media-content" initial={{ opacity: 0, y: reduced ? 0 : 15, filter: reduced ? "none" : "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: reduced ? 0 : -12, filter: reduced ? "none" : "blur(5px)" }} transition={{ duration: reduced ? 0 : 0.3 }}>
                <p className="media-title text-balance">{previews[active].title}</p>
                <p className="media-subtitle">{previews[active].subtitle}</p>
                <span className="media-placeholder-label font-mono">PRODUCT FILM COMING SOON</span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="workspace-footer"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" aria-hidden="true" />Your data stays yours.</span><span className="font-mono">100% in your control</span></div>
        </motion.div>
        <motion.div className="license-float" initial={{ opacity: 0, y: reduced ? 0 : 25, rotate: reduced ? 0 : -5 }} animate={{ opacity: 1, y: 0, rotate: reduced ? 0 : -3 }} transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="license-float-icon"><UsersIcon className="size-6" strokeWidth={1.5} aria-hidden="true" /></div>
          <div><p>More people. Same price.</p><span>No per-seat fees. Ever.</span></div>
          <span className="license-check"><Check className="size-3.5" aria-hidden="true" /></span>
        </motion.div>
      </motion.div>
    </div>
  )
}

const benefits = [
  { icon: Server, title: "Dedicated VPS workspace", detail: "5 GB storage. Your private instance." },
  { icon: InfinityIcon, title: "No per-seat pricing", detail: "Grow your team, not your bill." },
  { icon: ShieldCheck, title: "1-on-1 support included", detail: "Continuous updates. Zero hidden fees." },
  { icon: Cloud, title: "Fully managed cloud", detail: "Automated backups. 99.9% uptime." },
]

export function Hero() {
  const heroEyebrow = useContent('landing_home_hero_eyebrow', 'BUSINESS SOFTWARE. REIMAGINED.');
  const heroTitle1 = useContent('landing_home_hero_title1', 'Your business.');
  const heroTitle2 = useContent('landing_home_hero_title2', 'Your software.');
  const heroTitle3 = useContent('landing_home_hero_title3', 'Your rules.');
  const heroDesc = useContent('landing_home_hero_desc', 'Powerful software with dedicated VPS performance and 5 GB storage. Not per-seat. Not needlessly complicated. Just built for the way you do business.');
  const heroBtn1 = useContent('landing_home_hero_btn1', 'Explore our products');
  const heroBtn2 = useContent('landing_home_hero_btn2', 'Common questions');
  const heroPrice = useContent('landing_home_hero_price', '₹1,000 / month. Unlimited users. 1 on 1 support.');

  return (
    <section aria-label="Business software on your terms">
      <div className="page-container hero-grid">
        <div className="hero-copy">
          <Reveal><SectionLabel>{heroEyebrow}</SectionLabel></Reveal>
          <AnimatedHeading lines={[{ text: heroTitle1 }, { text: heroTitle2 }, { text: heroTitle3, accent: true }]} />
          <Reveal delay={0.25}><p className="hero-description text-pretty">{heroDesc}</p></Reveal>
          <Reveal delay={0.35}>
            <div className="hero-actions">
              <a href="#products" className={cn(buttonVariants({ size: "lg" }), "hero-cta")}>{heroBtn1}<ArrowUpRight data-icon="inline-end" /></a>
              <a href="#faq" className="text-link">{heroBtn2}<ArrowDown className="size-4" aria-hidden="true" /></a>
            </div>
            <div className="hero-price"><span className="price-dot" aria-hidden="true" /><span><strong>{heroPrice.split('. ')[0]}.</strong> {heroPrice.split('. ').slice(1).join('. ')}</span></div>
          </Reveal>
        </div>
        <Reveal delay={0.25} className="hero-visual"><WorkspacePreview /></Reveal>
      </div>
      <div className="page-container">
        <div className="benefits-strip">
          {benefits.map((benefit, index) => <Reveal key={benefit.title} delay={index * 0.07} className="benefit"><benefit.icon className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" /><div><p>{benefit.title}</p><span>{benefit.detail}</span></div></Reveal>)}
        </div>
      </div>
    </section>
  )
}
