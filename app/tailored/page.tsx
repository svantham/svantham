import { SiteHeader } from '@/components/tailored/site-header'
import { Hero } from '@/components/tailored/hero'
import { Portfolio } from '@/components/tailored/portfolio'
import { Services } from '@/components/tailored/services'
import { Testimonials } from '@/components/tailored/testimonials'
import { SiteFooter } from '@/components/tailored/site-footer'
import { Separator } from '@/components/tailored/ui/separator'

import { getSvanthamData } from '@/lib/get-data'
import { DataProvider } from '@/components/data-provider'

export default async function Page() {
  const data = await getSvanthamData();
  return (
    <DataProvider data={data}>
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
