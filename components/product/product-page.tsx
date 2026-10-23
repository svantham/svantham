'use client'

import { useState, useMemo } from 'react'
import { ArrowUpRight, Check, Database, Infinity as InfinityIcon, Server, Users } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/product/ui/accordion'
import { Badge } from '@/components/product/ui/badge'
import { Button } from '@/components/product/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/product/ui/dialog'
import { Separator } from '@/components/product/ui/separator'
import { Slider } from '@/components/product/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/product/ui/toggle-group'
import { formatINR, product, productFAQs } from '@/lib/product'
import { useContent, useData } from '@/components/data-provider'
import { Brand } from './brand'
import { Pricing } from '@/components/landing/pricing'
import { ProductHero } from './hero'
import { AnimatedMoney, ProductMotionProvider, Reveal } from './motion'
import { ProductNavigation } from './navigation'
import { ProductPreview, getProductViews } from './product-preview'
import { cn } from '@/lib/utils'

export function ProductPage({ id }: { id: string }) {
  const data = useData();
  const p = data.products?.[id] || {} as any;
  const productUpper = id.toUpperCase();
  const productViews = useMemo(() => getProductViews(id), [id]);
  const [tourOpen, setTourOpen] = useState(false)
  const [tourView, setTourView] = useState<string>(productViews[0]?.value || 'overview')
  const [teamSize, setTeamSize] = useState(product.comparisonBaseUsers);
  const comparisonCost = teamSize * product.comparisonAnnualPerUser;
  const savings = Math.max(0, comparisonCost - ((product as any).annualSubscription || product.annualLicense));

  const benefits = [
    {
      icon: Database,
      title: (p.benefits?.[0]?.title || p.benefit_1_title || 'Own your business data'),
      copy: (p.benefits?.[0]?.copy || p.benefit_1_copy || 'Keep customer context secure in your dedicated cloud workspace, shaped around your operation.'),
    },
    {
      icon: Users,
      title: (p.benefits?.[1]?.title || p.benefit_2_title || 'Invite the whole team'),
      copy: (p.benefits?.[1]?.copy || p.benefit_2_copy || 'Sales, service, and leadership share one source of truth without a new charge for every person.'),
    },
    {
      icon: Server,
      title: (p.benefits?.[2]?.title || p.benefit_3_title || 'Fast, managed cloud'),
      copy: (p.benefits?.[2]?.copy || p.benefit_3_copy || 'Fully managed SaaS infrastructure. We handle backups, security, and updates so you don’t have to.'),
    },
  ]

  return (
    <ProductMotionProvider>
      <main
        id="top"
        data-product={id}
        className={cn(
          "min-h-screen bg-background text-foreground product-page",
          `product-theme-${id}`
        )}
      >
        <ProductNavigation id={id} />
        <ProductHero id={id} onTour={() => setTourOpen(true)} />

        <section id="why-product" aria-labelledby="why-heading" className="page-shell pt-20 md:pt-28 pb-0">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div className="flex flex-col gap-5">
                <p className="section-eyebrow font-mono">{(p.built_around || 'BUILT AROUND OWNERSHIP')}</p>
                <h2 id="why-heading" className="section-title text-balance">{(p.comp_title || `A ${productUpper} that answers to your business.`)}</h2>
              </div>
              <p className="max-w-2xl text-lg text-muted-foreground">{(p.comp_desc || `Most enterprise software costs compound as your team grows. ${productUpper} keeps pricing simple while giving you room to build your own operating rhythm.`)}</p>
            </div>
          </Reveal>
          <div className="grid gap-6 pt-14 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <article className="flex h-full flex-col gap-6 border-t border-border py-7">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                    <p className="text-muted-foreground">{copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="product-details-preview mt-12 p-4 md:p-8">
            <div className="overflow-x-auto">
              <video autoPlay loop muted playsInline className="w-full rounded-xl border border-border shadow-2xl">
                <source src="/placeholder.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>
        </section>

        <Pricing productId={id} />


        <section id="faqs" aria-labelledby="faq-heading" className="page-shell py-24 md:py-32 border-t border-border mt-12 md:mt-20">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <Reveal>
              <div className="flex flex-col gap-5">
                <p className="section-eyebrow font-mono">{useContent('product_page_details', 'THE DETAILS')}</p>
                <h2 id="faq-heading" className="section-title text-balance">{useContent('product_page_questions', 'Questions, answered plainly.')}</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Accordion defaultValue={['faq-0']}>
                {(p.faqs && p.faqs.length > 0 ? p.faqs : productFAQs).map((item: any, index: number) => (
                  <AccordionItem key={item.question} value={`faq-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent><p className="pb-5 text-muted-foreground">{item.answer}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-border">
          <div className="page-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <Brand compact />
          </div>
        </footer>

        <Dialog open={tourOpen} onOpenChange={setTourOpen}>
          <DialogContent className="max-h-[92vh] overflow-y-auto p-4 sm:max-w-4xl md:p-6">
            <DialogHeader>
              <DialogTitle>Explore the {productUpper} workspace</DialogTitle>
              <DialogDescription>Switch between sample workspace views. All information shown is illustrative.</DialogDescription>
            </DialogHeader>
            <ToggleGroup
              value={[tourView]}
              variant="outline"
              onValueChange={(values) => {
                const nextView = values[0]
                if (nextView && productViews.some((item) => item.value === nextView)) setTourView(nextView)
              }}
              aria-label="Choose a workspace view"
              className="flex-wrap"
            >
              {productViews.map(({ value, label, icon: Icon }) => (
                <ToggleGroupItem key={value} value={value} aria-label={label}>
                  <Icon data-icon="inline-start" />
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ProductPreview id={id} className="tour-preview" view={tourView} onViewChange={setTourView} />
          </DialogContent>
        </Dialog>
      </main>
    </ProductMotionProvider>
  )
}
