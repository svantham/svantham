import type { Metadata } from 'next'
import { SiteHeader } from '@/components/tailored/site-header'
import { Hero } from '@/components/tailored/hero'
import { Portfolio } from '@/components/tailored/portfolio'
import { Services } from '@/components/tailored/services'
import { Testimonials } from '@/components/tailored/testimonials'
import { SiteFooter } from '@/components/tailored/site-footer'
import { Separator } from '@/components/tailored/ui/separator'

import { getSvanthamData } from '@/lib/get-data'
import { DataProvider } from '@/components/data-provider'

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tailored by Svantham — Bespoke Software & Custom Platforms',
  description: 'Custom software, internal platforms, and thoughtful digital engineering built around your business. Not off the shelf. Made just for you.',
  alternates: {
    canonical: '/tailored',
  },
  openGraph: {
    title: 'Tailored by Svantham — Bespoke Software & Custom Platforms',
    description: 'Custom software, internal platforms, and thoughtful digital engineering built around your business.',
    url: 'https://svantham.in/tailored',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tailored by Svantham — Bespoke Software & Custom Platforms',
    description: 'Custom software and platforms built around your business operations.',
  },
}

const tailoredJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Tailored by Svantham',
  url: 'https://svantham.in/tailored',
  description: 'Bespoke software development, custom internal platforms, and digital engineering built for your operations.',
  provider: {
    '@type': 'Organization',
    name: 'Svantham',
    url: 'https://svantham.in',
  },
}

export default async function Page() {
  const data = await getSvanthamData()
  return (
    <DataProvider data={data}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tailoredJsonLd) }}
      />
      <div className="tailored-page min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main id="main">
          <Hero />
          <div className="page-shell"><Separator /></div>
          <Portfolio />
          <Services />
          <Testimonials />
        </main>
        <SiteFooter />
      </div>
    </DataProvider>
  )
}
