import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

import { getSvanthamData } from '@/lib/get-data'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSvanthamData()
  const { content } = data

  return {
    metadataBase: new URL('https://svantham.com'),
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
  themeColor: '#12140f', // Use the dark background instead
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

