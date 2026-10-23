import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono } from 'next/font/google'
import { DM_Mono, Manrope, Instrument_Serif } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' })

export const metadata: Metadata = {
  title: 'Svantham — Your Business. Your Software. Your Rules.',
  description: 'Business software on your terms. Explore CRM, POSS, HRMS, FSM and OMS. Cloud SaaS, no per-seat fees, predictable flat subscription with 1-on-1 support included.',
  applicationName: 'Svantham',
  openGraph: {
    title: 'Svantham — Business software. On your terms.',
    description: 'Cloud workspace. Unlimited users. One predictable subscription with updates and support included. Discover a different kind of business software.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: 'Svantham — Business software. On your terms.',
    description: 'Modern cloud SaaS. No per-seat pricing. Full updates and support included.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`light bg-background ${geist.variable} ${geistMono.variable} ${manrope.variable} ${dmMono.variable} ${instrument.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
