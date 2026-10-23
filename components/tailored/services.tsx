'use client'

import { useContent } from '@/components/data-provider'
import { ArrowUpRight, CodeXml, PenTool, TrendingUp } from 'lucide-react'
import { contact } from '@/lib/site-content'

const services = [
  {
    icon: CodeXml,
    title: 'Software that fits.',
    description: 'From the first sketch to the final deploy. Websites, applications, and custom tools that work the way your business does.',
    offerings: ['Custom software & web apps', 'Websites & digital experiences', 'UI/UX & product design', 'Integrations & automation'],
    label: 'Build with us',
    subject: 'Let’s talk custom software',
  },
  {
    icon: PenTool,
    title: 'Stories that stick.',
    description: 'Your brand has something worth saying. We find the words, visuals, and ideas that make people stop and listen.',
    offerings: ['Content strategy & copywriting', 'Brand storytelling', 'Social media content', 'Creative & visual direction'],
    label: 'Create with us',
    subject: 'Let’s talk content',
  },
  {
    icon: TrendingUp,
    title: 'Growth with intent.',
    description: 'Not just more eyeballs. The right ones. Digital marketing that connects your business to the people who need it.',
    offerings: ['Digital marketing strategy', 'Social media management', 'Search engine optimization', 'Paid campaigns & analytics'],
    label: 'Grow with us',
    subject: 'Let’s talk digital marketing',
  },
]

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-secondary text-secondary-foreground">
      <div className="page-shell py-16 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-4"><p className="eyebrow text-secondary-foreground/70">{useContent('tailored_services_eyebrow', 'What we bring to the table')}</p><h2 id="services-heading" className="section-heading">{useContent('tailored_services_h2_1', 'Built well. Told well.')}<br /><span className="font-serif italic">{useContent('tailored_services_h2_2', 'Seen by the right people.')}</span></h2></div>
          <p className="max-w-xs text-base leading-relaxed text-secondary-foreground/70">{useContent('tailored_services_p1_1', 'The technical and the creative.')}<br />{useContent('tailored_services_p1_2', 'Together, under one roof.')}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 pt-10 md:grid-cols-3 md:pt-12">
          {services.map((service, idx) => (
            <article key={service.title} className="service-card flex flex-col rounded-xl border border-secondary-foreground/10 p-7 lg:p-8">
              <service.icon className="size-7 text-primary" strokeWidth={1.2} aria-hidden="true" />
              <h3 className="pt-8 text-2xl font-medium tracking-tight">{useContent(`tailored_services_item_${idx}_title`, service.title)}</h3>
              <p className="pt-4 text-base leading-relaxed text-secondary-foreground/70">{useContent(`tailored_services_item_${idx}_desc`, service.description)}</p>
              <ul className="flex flex-col gap-3 py-7">{service.offerings.map((offering, offIdx) => <li key={offering} className="flex items-center gap-3 text-sm"><span className="size-1 shrink-0 rounded-full bg-sage" aria-hidden="true" />{useContent(`tailored_services_item_${idx}_offering_${offIdx}`, offering)}</li>)}</ul>
              <a href={`mailto:${contact.email}?subject=${encodeURIComponent(service.subject)}`} className="text-link mt-auto w-fit pt-4">{useContent(`tailored_services_item_${idx}_label`, service.label)}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
