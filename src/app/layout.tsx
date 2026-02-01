import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'EternGift - Express Your Love with Perfect Gifts',
  description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets. Perfect for Valentine\'s Day, anniversaries, and special moments.',
  keywords: ['eternal roses', 'romantic gifts', 'valentine gifts', 'jewelry', 'gift sets', 'rose bears'],
  authors: [{ name: 'EternGift' }],
  openGraph: {
    title: 'EternGift - Express Your Love with Perfect Gifts',
    description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets.',
    url: 'https://eterngift.com',
    siteName: 'EternGift',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EternGift - Express Your Love with Perfect Gifts',
    description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets.',
  },
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
