"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, ArrowUpRight, Check, Minus, UsersRound } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/landing/motion"
import { cn } from "@/lib/utils"
import { useContent } from "@/components/data-provider"

const annualSubscription = 12000
const illustrativeAnnualSeatCost = 10000

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

function AnimatedAmount({ value }: { value: number }) {
  const reduced = useReducedMotion()
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: reduced ? 0 : 12, filter: reduced ? "none" : "blur(3px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: reduced ? 0 : -12 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        className="inline-block"
      >
        {formatINR(value)}
      </motion.span>
    </AnimatePresence>
  )
}

export function Pricing({ productId }: { productId?: string } = {}) {
  const isPoss = productId === 'poss'
  const planPrice = isPoss ? 3000 : annualSubscription
  const formulaDefault = isPoss
    ? '₹3,000 per year. Unlimited registers & cashiers.'
    : '₹1,000 per month (₹12,000 / year). Not a price per person.'
  const [people, setPeople] = useState(10)
  const saasTotal = people * illustrativeAnnualSeatCost
  const savings = Math.max(0, saasTotal - planPrice)
  return (
    <section id="pricing" className="pricing-section section-spacing">
      <div className="page-container">
        <Reveal className="pricing-heading flex flex-col items-center text-center gap-4 pb-12">
          <h2 className="section-heading text-balance">
            {useContent('landing_pricing_h2_1', 'Your team gets bigger.')}<br /><span className="text-primary">{useContent('landing_pricing_h2_2', 'Your software bill doesn’t.')}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{useContent('landing_pricing_sub', 'One predictable annual subscription. No spreadsheet required.')}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="pricing-calculator overflow-hidden bg-background">
            <div className="team-control">
              <div className="team-control-label">
                <span id="team-size-label" className="flex items-center gap-2"><UsersRound className="size-4" aria-hidden="true" />{useContent('landing_pricing_team_q', 'How big is your team?')}</span>
                <output className="team-size" aria-live="polite">{people} {useContent('landing_pricing_team_people', 'people')}</output>
              </div>
              <Slider thumbLabel={useContent('landing_pricing_team_slider', 'Number of people in your team')} value={[people]} min={10} max={100} step={5} onValueChange={(value) => setPeople(Array.isArray(value) ? value[0] : value)} className="team-slider" />
              <div className="slider-labels font-mono text-muted-foreground"><span>10 {useContent('landing_pricing_team_people_upper', 'PEOPLE')}</span><span>100 {useContent('landing_pricing_team_people_upper', 'PEOPLE')}</span></div>
            </div>

            <div className="comparison-grid">
              <div className="comparison-saas bg-background">
                <p className="comparison-eyebrow">{useContent('landing_pricing_saas_eyebrow', 'THE PER-SEAT WAY')}</p>
                <h3>{useContent('landing_pricing_saas_title', 'Traditional SaaS')}</h3>
                <p className="comparison-description">{useContent('landing_pricing_saas_desc', 'Illustrative Zoho CRM-style pricing')}</p>
                <div className="comparison-price"><AnimatedAmount value={saasTotal} /><span>/ {useContent('landing_pricing_year', 'year')}</span></div>
                <p className="comparison-formula">{people} {useContent('landing_pricing_formula_people', 'people')} × ₹10,000 {useContent('landing_pricing_formula_per', 'per person / year')}</p>
                <ul className="comparison-features">
                  <li><Minus className="size-4 text-muted-foreground" aria-hidden="true" />{useContent('landing_pricing_saas_feat_1', 'Costs climb with every new seat')}</li>
                  <li><Minus className="size-4 text-muted-foreground" aria-hidden="true" />{useContent('landing_pricing_saas_feat_2', 'Hosted on the provider’s infrastructure')}</li>
                  <li><Minus className="size-4 text-muted-foreground" aria-hidden="true" />{useContent('landing_pricing_saas_feat_3', 'Limits depend on your plan')}</li>
                </ul>
              </div>

              <div className="comparison-sv bg-secondary">
                <div className="flex flex-col items-start gap-1.5 pb-2">
                  <span className="fair-price-label text-left w-full">{useContent('landing_pricing_sv_eyebrow', 'THE YOUR-TERMS WAY')}</span>
                  <div className="flex items-center gap-2.5 mt-1">
                    <img src="/icon.svg" className="h-8 w-auto" alt="Svantham" />
                    <span className="font-bold text-2xl tracking-tight">Svantham</span>
                  </div>
                </div>
                <div className="comparison-price text-primary"><span>{formatINR(planPrice)}</span><span>/ {useContent('landing_pricing_year', 'year')}</span></div>
                <p className="comparison-formula">{isPoss ? formulaDefault : useContent('landing_pricing_sv_formula', formulaDefault)}</p>
                <ul className="comparison-features">
                  <li><Check className="size-4 text-primary" aria-hidden="true" />{useContent('landing_pricing_sv_feat_1', 'No per-seat charges')}</li>
                  <li><Check className="size-4 text-primary" aria-hidden="true" />{useContent('landing_pricing_sv_feat_2', 'Fully managed cloud workspace')}</li>
                  <li><Check className="size-4 text-primary" aria-hidden="true" />{useContent('landing_pricing_sv_feat_3', 'Continuous updates & 1-on-1 support included')}</li>
                </ul>
                <a href="#products" className={cn(buttonVariants({ size: "lg" }), "pricing-cta w-full mt-6")}>{useContent('landing_pricing_sv_cta', 'Find your software')}<ArrowUpRight className="ml-2 size-4" /></a>
              </div>
            </div>

            <div className="savings-strip border-t border-border bg-muted/40">
              <span className="flex items-center gap-2 font-medium"><ArrowRight className="size-5 text-primary" aria-hidden="true" />{useContent('landing_pricing_savings_label', 'More for your business. Less for your software.')}</span>
              <p className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm uppercase tracking-wider">{useContent('landing_pricing_savings_sub', 'Illustrative annual savings')}</span>
                <strong className="text-2xl font-bold" aria-live="polite"><AnimatedAmount value={savings} /></strong>
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="pricing-disclaimer text-center mt-6">
            {useContent('landing_pricing_disclaimer', 'An illustrative comparison obnly, not a live quote; actual SaaS pricing varies by plan and billing terms. Pricing excludes applicable taxes and hardware or cloud infrastructure costs. Capacity is subject to your hardware.')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
