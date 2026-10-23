import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Products } from "@/components/landing/products"
import { Closing, SiteFooter } from "@/components/landing/closing"
import { MotionProvider } from "@/components/landing/motion"

import { getSvanthamData } from '@/lib/get-data'
import { DataProvider } from '@/components/data-provider'

export default async function Page() {
  const data = await getSvanthamData();
  return (
    <DataProvider data={data}>
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
