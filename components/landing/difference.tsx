"use client"

import { HardDrive, Infinity as InfinityIcon, ShieldCheck } from "lucide-react"
import { Reveal, SectionLabel } from "@/components/landing/motion"
import { useContent } from "@/components/data-provider"

const principles = [
  {
    icon: HardDrive,
    title: "Your data is your business.",
    description: "Secure, private, and always available. Your operations stay protected with enterprise encryption.",
    note: "SECURE CLOUD",
  },
  {
    icon: InfinityIcon,
    title: "Growth shouldn't come with a penalty.",
    description: "Add teammates, not seat fees. No artificial user caps or usage penalties. Build without per-person friction.",
    note: "UNLIMITED USERS",
  },
  {
    icon: ShieldCheck,
    title: "Support is part of the deal.",
    description: "Full updates, continuous improvements, and dedicated 1-on-1 support are built directly into your subscription.",
    note: "SUPPORT INCLUDED",
  },
]

export function Difference() {
  return (
    <section id="difference" className="difference-section section-spacing">
      <div className="page-container">
        <Reveal><SectionLabel>{useContent('landing_diff_label', 'A DIFFERENT KIND OF SOFTWARE COMPANY')}</SectionLabel></Reveal>
        <div className="section-heading-row mb-12">
          <Reveal>
            <h2 className="section-heading difference-heading text-balance">
              {useContent('landing_diff_h2_1', 'Built for your business.')}<br />
              <span className="text-primary">{useContent('landing_diff_h2_2', 'Not your monthly bill.')}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="difference-intro text-pretty">
              {useContent('landing_diff_intro', 'Traditional SaaS rents you access and penalizes your headcount. We give you a modern, unified cloud workspace with predictable, flat-rate pricing.')}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.1}>
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-background p-7 lg:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <principle.icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground text-balance">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-border/50">
                  <span className="font-mono text-xs font-medium tracking-wider text-primary uppercase">
                    {principle.note}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
