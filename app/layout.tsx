import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

import { getSvanthamData } from '@/lib/get-data'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSvanthamData()
  const { content } = data

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://svantham.com')),
    title: content.seo_title,
    description: content.seo_description,
    openGraph: {
      title: content.seo_og_title || content.seo_title,
      description: content.seo_og_description || content.seo_description,
      images: [
        {
          url: content.seo_og_image,
          width: 1200,
          height: 630,
          alt: 'Svantham Logo',
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo_og_title || content.seo_title,
      description: content.seo_og_description || content.seo_description,
      images: [content.seo_og_image],
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    generator: 'Svantham',
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#12140f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geom:ital,wght@0,300..900;1,300..900&family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap"
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
