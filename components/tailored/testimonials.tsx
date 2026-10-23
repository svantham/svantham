'use client'

import { useState, useEffect } from 'react'
import { UserRound } from 'lucide-react'
import { testimonials } from '@/lib/site-content'
import { useContent } from '@/components/data-provider'

export function Testimonials() {
  const [active, setActive] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const current = testimonials[active]

  return (
    <section aria-labelledby="testimonials-heading" aria-roledescription="carousel" className="page-shell py-20 md:py-28">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-16 rounded-xl bg-primary p-8 text-primary-foreground md:p-12 lg:p-16">
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow text-primary-foreground/70">{useContent('tailored_testimonials_eyebrow', 'Good work. Better relationships.')}</p>
          <h2 id="testimonials-heading" className="section-heading">{useContent('tailored_testimonials_h2_1', 'The other side')}<br /><span className="font-serif italic">{useContent('tailored_testimonials_h2_2', 'of the story.')}</span></h2>
          <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">{useContent('tailored_testimonials_p1_1', 'A space for the people we build with.')}<br />{useContent('tailored_testimonials_p1_2', 'Replace these placeholders with approved client testimonials.')}</p>
        </div>
        <div aria-live="polite" aria-atomic="true" aria-roledescription="slide" aria-label={`${active + 1} of ${testimonials.length}`} className="flex flex-col justify-between gap-8 rounded-xl border border-primary-foreground/20 p-7 md:p-10">
          <span className="w-fit rounded-full bg-primary-foreground/10 px-3 py-1.5 text-sm text-primary-foreground">{useContent('tailored_testimonials_badge', 'Testimonial placeholder')}</span>
          <blockquote className="text-pretty font-serif text-[32px] leading-[1.25] tracking-[-0.025em] md:text-[38px]">{current.quote}</blockquote>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/5"><UserRound className="size-5 text-primary-foreground/60" strokeWidth={1.3} aria-hidden="true" /></span><div className="flex flex-col gap-1"><p className="text-sm font-medium">{current.name}</p><p className="text-sm text-primary-foreground/70">{current.role}</p></div></div>
            <span className="text-sm text-primary-foreground/70">{current.category}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
