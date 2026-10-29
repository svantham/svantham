import type { Metadata } from 'next'
import { ProductPage } from '@/components/product/product-page'
import { getSvanthamData } from '@/lib/get-data'
import { DataProvider } from '@/components/data-provider'

export function generateStaticParams() {
  return [
    { id: 'crm' },
    { id: 'poss' },
    { id: 'hrms' },
    { id: 'fsm' },
    { id: 'oms' },
  ]
}

const productMeta: Record<
  string,
  {
    title: string
    description: string
    categoryName: string
    applicationCategory: string
    price: string
    priceUnit: string
  }
> = {
  crm: {
    title: 'Svantham CRM — Customer Relationships & Sales Pipeline Workspace',
    description:
      'Every customer relationship in one cloud workspace. Manage leads, track customer history, and align your team without per-seat fees at ₹1,000/month.',
    categoryName: 'Customer Relationship Management Software',
    applicationCategory: 'BusinessApplication',
    price: '12000',
    priceUnit: '₹1,000 / month (billed ₹12,000 / year)',
  },
  poss: {
    title: 'Svantham POSS — Point of Sale & Retail Counter Software',
    description:
      'Keep your sales moving and your counters connected. Cloud POS software with fast billing, inventory sync, and multi-counter coordination at ₹3,000/year.',
    categoryName: 'Point of Sale Software',
    applicationCategory: 'PointOfSale',
    price: '3000',
    priceUnit: '₹3,000 / year',
  },
  hrms: {
    title: 'Svantham HRMS — Human Resources & People Operations Software',
    description:
      'Bring your people operations together. Employee profiles, attendance tracking, leave requests, and payroll readiness without per-seat user fees.',
    categoryName: 'Human Resources Software',
    applicationCategory: 'BusinessApplication',
    price: '12000',
    priceUnit: '₹1,000 / month (billed ₹12,000 / year)',
  },
  fsm: {
    title: 'Svantham FSM — Field Service Management & Team Dispatch',
    description:
      'From your office to the field. Schedule dispatch, track job orders, and manage field technicians with mobile workflows in one shared system.',
    categoryName: 'Field Service Management Software',
    applicationCategory: 'BusinessApplication',
    price: '12000',
    priceUnit: '₹1,000 / month (billed ₹12,000 / year)',
  },
  oms: {
    title: 'Svantham OMS — Order Management & Fulfillment Tracking',
    description:
      'Keep every customer order under control from placement to delivery. Real-time fulfillment tracking, inventory visibility, and smooth operations.',
    categoryName: 'Order Management Software',
    applicationCategory: 'BusinessApplication',
    price: '12000',
    priceUnit: '₹1,000 / month (billed ₹12,000 / year)',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const slug = id.toLowerCase()
  const meta = productMeta[slug] || {
    title: `Svantham ${slug.toUpperCase()} — Business Software Workspace`,
    description: `Dedicated cloud workspace for ${slug.toUpperCase()}. Unlimited users, dedicated VPS instance, and predictable flat subscription.`,
    categoryName: 'Business Software',
    applicationCategory: 'BusinessApplication',
    price: '12000',
    priceUnit: '₹1,000 / month',
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://svantham.in/product/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const slug = id.toLowerCase()
  const data = await getSvanthamData()
  const meta = productMeta[slug] || {
    title: `Svantham ${slug.toUpperCase()}`,
    description: `Cloud workspace for ${slug.toUpperCase()}.`,
    categoryName: 'Business Software',
    applicationCategory: 'BusinessApplication',
    price: '12000',
    priceUnit: '₹1,000 / month',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Svantham ${slug.toUpperCase()}`,
    applicationCategory: meta.applicationCategory,
    operatingSystem: 'Web, Cloud SaaS',
    description: meta.description,
    url: `https://svantham.in/product/${slug}`,
    offers: {
      '@type': 'Offer',
      price: meta.price,
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: 'Svantham',
      url: 'https://svantham.in',
    },
  }

  return (
    <DataProvider data={data}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPage id={slug} />
    </DataProvider>
  )
}
