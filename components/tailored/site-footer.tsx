'use client'

import { useContent } from '@/components/data-provider'
import { ArrowUp, ArrowUpRight, MessageCircle, Mail, Asterisk } from 'lucide-react'
import { contact } from '@/lib/site-content'

export function SiteFooter() {
  return (
    <footer id="footer" className="page-shell pt-6">
      <div className="flex flex-col justify-between gap-6 pb-12 md:flex-row md:items-start">
        <div className="flex flex-col gap-2"><p className="text-base">{useContent('tailored_footer_p1', 'Consider it yours.')}</p><p className="text-sm text-muted-foreground">{useContent('tailored_footer_p2', 'Thoughtfully built. Proudly Svantham.')}</p></div>
        <div className="flex flex-col gap-2"><a href={`mailto:${contact.email}`} className="text-link">{contact.email}<ArrowUpRight className="size-4" aria-hidden="true" /></a><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-primary">{contact.phone}</a></div>
        <a href="#home" className="text-link">{useContent('tailored_footer_totop', 'Back to top')} <ArrowUp className="size-4" aria-hidden="true" /></a>
      </div>
      <div className="flex items-end justify-between gap-3 overflow-hidden pb-6" aria-hidden="true"><span className="footer-wordmark font-semibold">{useContent('tailored_footer_wordmark_1', 'tailored')}<span className="text-clay">*</span></span><span className="hidden shrink-0 pb-3 text-sm text-muted-foreground lg:inline">{useContent('tailored_footer_wordmark_2', 'by svantham')}</span></div>
      <div className="flex flex-col justify-between gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row"><p>© {new Date().getFullYear()} {useContent('tailored_footer_copyright', 'Svantham. All rights reserved.')}</p></div>
    </footer>
  )
}
