"use client"

import Link from "next/link"
import { ArrowUpRight, Boxes, ContactRound, ScanLine, UsersRound, Wrench } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Reveal, SectionLabel } from "@/components/landing/motion"
import { useContent, useData } from "@/components/data-provider"

export const products = [
  { name: "CRM", slug: "crm", title: "Customer relationships", description: "Turn connections into lasting customer relationships.", icon: ContactRound },
  { name: "POSS", slug: "poss", title: "Point of sale", description: "Keep your sales moving and your counters connected.", icon: ScanLine },
  { name: "HRMS", slug: "hrms", title: "Human resources", description: "Less people paperwork. More room for your people.", icon: UsersRound },
  { name: "FSM", slug: "fsm", title: "Field service", description: "Bring your field teams and service operations together.", icon: Wrench },
  { name: "OMS", slug: "oms", title: "Order management", description: "Keep every order in sight, from start to finish.", icon: Boxes },
]

export function Products() {
  const data = useData();
  const l_prod_label = useContent('landing_prod_label', 'THE SVANTHAM SUITE');
  const l_prod_h1 = useContent('landing_prod_h1', 'Big on capability.');
  const l_prod_h2 = useContent('landing_prod_h2', 'Not on complexity.');
  const l_prod_intro = useContent('landing_prod_intro', 'Five focused products. One refreshingly fair approach. Find the right tools for your next chapter.');
  const l_prod_cap = useContent('landing_prod_cap', 'Different jobs. The same promise: your software, on your terms.');
  const reduced = useReducedMotion()

  const displayProducts = products.map(p => {
    const mod = data.modules?.find(m => m.id === p.slug);
    return { ...p, title: mod?.description || p.title, name: mod?.name || p.name };
  });

  return (
    <section id="products" className="products-section section-spacing">
      <div className="page-container">
        <Reveal><SectionLabel>{l_prod_label}</SectionLabel></Reveal>
        <div className="section-heading-row">
          <Reveal><h2 className="section-heading text-balance">{l_prod_h1}<br /><span className="text-muted-foreground">{l_prod_h2}</span></h2></Reveal>
          <Reveal delay={0.1}><p className="section-intro text-pretty">{l_prod_intro}</p></Reveal>
        </div>
        <div className="product-grid">
          {displayProducts.map((product, index) => (
            <Reveal key={product.slug} delay={index * 0.065}>
              <motion.div className="h-full" whileHover={reduced ? {} : { y: -7 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                <Link href={`/product/${product.slug}`} prefetch={false} className="product-card pb-5" aria-label={`Explore ${product.name}: ${product.title}`}>
                  <div className="product-card-title"><h3>{product.name}</h3><p className="text-muted-foreground mt-1">{product.title}</p></div>
                  <span className="product-bottom mt-auto font-medium text-sm pt-8">{useContent('landing_products_explore', 'Explore')} {product.name}<ArrowUpRight className="size-4" aria-hidden="true" /></span>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <motion.div className="mt-4" whileHover={reduced ? {} : { y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
            <Link href="/tailored" prefetch={false} className="flex items-center justify-between rounded-xl bg-primary text-primary-foreground p-6 md:p-8 hover:brightness-110 transition">
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">{useContent('landing_products_tailored_h3', 'Looking for something custom?')}</h3>
                <p className="mt-1 md:mt-2 text-sm font-medium opacity-80">{useContent('landing_products_tailored_p', 'If you want something custom made, we do that too. Enter the studio.')}</p>
              </div>
              <ArrowUpRight className="size-6 md:size-8 opacity-80" />
            </Link>
          </motion.div>
        </Reveal>
        <Reveal><p className="products-caption mt-6"><span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />{l_prod_cap}</p></Reveal>
      </div>
    </section>
  )
}
