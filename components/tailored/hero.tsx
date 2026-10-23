'use client'

import { useContent } from '@/components/data-provider'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk } from 'lucide-react'

function TailoringLabel() {
  return (
    <div className="tailoring-label" role="img" aria-label="Not off the shelf. Made for you. A Svantham tailored.">
      <div className="label-stitches" aria-hidden="true">
        <span className="text-base font-medium tracking-[0.06em]">{useContent('tailored_hero_label_1', 'SVANTHAM TAILORED')}</span>
        <div className="text-center text-[51px] leading-[1.05] font-medium tracking-[-0.055em]">{useContent('tailored_hero_label_2', 'not off')}<br />{useContent('tailored_hero_label_3', 'the shelf.')}<br /><span className="whitespace-nowrap font-serif text-[48px] italic">{useContent('tailored_hero_label_4', 'just for you.')}</span></div>
        <span className="whitespace-nowrap text-sm tracking-[0.06em]">{useContent('tailored_hero_label_5', 'THOUGHTFULLY MADE.')}</span>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-heading" className="page-shell pb-7 pt-14 md:pt-16 lg:pt-20">
      <div className="flex items-center justify-between gap-8 pt-7">
        <h1 id="hero-heading" className="hero-title hero-enter text-balance">{useContent('tailored_hero_h1_1', 'Your vision.')}<em className="font-serif">{useContent('tailored_hero_h1_3', 'tailored.')}</em><br />{useContent('tailored_hero_h1_2', 'Perfectly ')}</h1>
        <div className="hero-enter-delay hidden shrink-0 px-8 lg:block"><TailoringLabel /></div>
      </div>
      <div className="hero-enter-delay flex flex-col items-start justify-between gap-7 pt-8 md:flex-row md:items-end lg:pt-9">
        <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">{useContent('tailored_hero_p1_1', 'Custom software, thoughtful content, and digital marketing.')}<br className="hidden xl:block" /> {useContent('tailored_hero_p1_2', 'Built around your business. Never the other way around.')}</p>
        <div className="flex flex-wrap items-center gap-6 md:gap-8">
          <a href="#footer" className="pill-link">{useContent('tailored_hero_btn_1', "Let's build something")} <ArrowUpRight className="size-4" aria-hidden="true" /></a>
          <a href="#work" className="text-link">{useContent('tailored_hero_btn_2', 'Explore our work')} <ArrowDownRight className="size-4" aria-hidden="true" /></a>
        </div>
      </div>
      <div className="hero-enter-last flex items-center justify-between gap-4 pt-16 md:pt-20">
        <div className="flex items-center gap-3 text-sm text-muted-foreground"><Asterisk className="size-5 text-clay" aria-hidden="true" /><span>{useContent('tailored_hero_footer_1', 'Good people. Thoughtful work. Real possibilities.')}</span></div>
        <a href="#work" className="hidden items-center gap-3 text-sm text-muted-foreground md:flex">{useContent('tailored_hero_footer_2', 'Scroll to discover')} <ArrowDown className="size-4" aria-hidden="true" /></a>
      </div>
    </section>
  )
}
