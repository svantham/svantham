"use client"

import Link from "next/link"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import { Brand, Reveal, SectionLabel } from "@/components/landing/motion"
import { products } from "@/components/landing/products"
import { contact } from "@/lib/site-content"
import { cn } from "@/lib/utils"
import { useContent } from "@/components/data-provider"

const faqs = [
  { question: "How is Svantham different from traditional SaaS?", answer: "Traditional SaaS charges per seat, penalizing you as your team grows. Svantham is modern SaaS built around a flat, predictable subscription. Add team members without paying for extra seats, and enjoy a unified cloud workspace shaped around your operations." },
  { question: "Is there really no limit on the number of users?", answer: "There are no per-seat fees or artificial user caps. Add your entire team to your workspace—whether 5 people or 500—without paying more for headcount." },
  { question: "What is included with the subscription?", answer: "The subscription is ₹1,000 per month (billed annually at ₹12,000 / year, or ₹3,000 / year for POSS). It includes your entire workspace, cloud hosting, continuous product updates, and 1-on-1 support." },
  { question: "How do updates and support work?", answer: "Updates are delivered continuously in the cloud, and dedicated 1-on-1 support is included with your subscription. No hidden add-ons or maintenance fees." },
  { question: "Can I cancel or switch plans?", answer: "Yes, you have full clarity and control over your subscription with straightforward yearly billing and no long-term lock-in traps." },
]

export function Closing() {
  return (
    <>
      <section id="faq" className="faq-section section-spacing">
        <div className="page-container faq-grid">
          <Reveal><SectionLabel>{useContent('landing_faq_label', 'A LITTLE MORE CLARITY')}</SectionLabel><h2 className="section-heading text-balance">{useContent('landing_faq_h2_1', 'Good questions.')}<br /><span className="text-muted-foreground">{useContent('landing_faq_h2_2', 'Straight answers.')}</span></h2><p className="faq-intro">{useContent('landing_faq_intro_1', 'Software decisions should feel clear.')}<br />{useContent('landing_faq_intro_2', 'Here are the things worth knowing.')}</p></Reveal>
          <Reveal delay={0.1}><Accordion className="faq-accordion" defaultValue={["faq-0"]}>{faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`}><AccordionTrigger>{faq.question}</AccordionTrigger><AccordionContent>{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></Reveal>
        </div>
      </section>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-main"><div className="footer-brand"><a href="#" aria-label="Svantham home"><Brand /></a><p>{useContent('landing_footer_brand_p_1', 'Business software.')}<br />{useContent('landing_footer_brand_p_2', 'On your terms.')}</p></div><nav aria-label="Product links" className="footer-nav"><p>{useContent('landing_footer_suite', 'THE SUITE')}</p><div>{products.map((product) => <Link key={product.slug} href={`/product/${product.slug}`} prefetch={false}>{product.name}<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>)}</div></nav><nav aria-label="Company links" className="footer-nav"><p>{useContent('landing_footer_way', 'THE SVANTHAM WAY')}</p><div><Link href="/tailored">{useContent('landing_footer_tailored', 'Tailored Studio')}</Link><a href="#faq">{useContent('landing_footer_faq', 'FAQs')}</a><a href={`mailto:${contact.email}`}>{useContent('landing_footer_contact', 'Contact')}</a></div></nav><a href="#" className="back-to-top" aria-label="Back to top"><ArrowUp className="size-5" aria-hidden="true" /></a></div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} Svantham. {useContent('landing_footer_rights', 'All rights reserved.')}</p></div>
      </div>
    </footer>
  )
}
