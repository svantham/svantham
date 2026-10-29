import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Products } from "@/components/landing/products"
import { Closing, SiteFooter } from "@/components/landing/closing"
import { MotionProvider } from "@/components/landing/motion"

import { getSvanthamData } from '@/lib/get-data'
import { DataProvider } from '@/components/data-provider'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Svantham',
  url: 'https://svantham.in',
  description:
    'Business software on your terms. Dedicated VPS workspace, flat subscription, no per-seat pricing. CRM, POSS, HRMS, FSM, OMS.',
  publisher: {
    '@type': 'Organization',
    name: 'Svantham',
    url: 'https://svantham.in',
    logo: 'https://svantham.in/logo.png',
  },
}

export default async function Page() {
  const data = await getSvanthamData();
  return (
    <DataProvider data={data}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <MotionProvider>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header />
        <main id="main-content">
          <Hero />
          <Products />
          <Closing />
        </main>
        <SiteFooter />
      </MotionProvider>
    </DataProvider>
  )
}
